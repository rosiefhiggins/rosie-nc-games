const request=require('supertest')
const app=require('../app')
const testData=require('../db/data/test-data/index')
const seed=require('../db/seeds/seed')
const db=require('../db/connection')


beforeEach(()=>{
    return seed(testData)
})

afterAll(()=>{
    return db.end()
})

describe('GET /api/categories',()=>{
    test('responds with status code 200', ()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
    })
    test('responds with an array of objects', ()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res)=>{
            expect(typeof res.body).toBe('object')
            expect(Array.isArray(res.body.categories)).toBe(true)
            res.body.categories.forEach((category)=>{
                expect(typeof category).toBe('object')
            })
        })
    })
    test('responds with an array of objects', ()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res)=>{
            expect(res.body.categories).toHaveLength(4)
            res.body.categories.forEach((category)=>{
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    })
})



describe('GET /api/reviews', ()=>{
    test('responds with status code 200 and an array of review objects', ()=>{
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((res)=>{
            expect(Array.isArray(res.body.reviews)).toBe(true)
            res.body.reviews.forEach((review)=>{
                expect(typeof review).toBe('object')
                expect(review).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })
    test('Reviews are ordered in descending order of dates', ()=>{
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
})


describe('GET /api/reviews/:review_id', ()=>{
    test('responds with status code 200 and a review object', ()=>{
        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then((res)=>{
            expect(typeof res.body).toBe('object')
            expect(typeof res.body.review).toBe('object')
        })
    })
    test('responds with the correct review keys', ()=>{
        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then((res)=>{
            expect(res.body.review).toEqual(
                expect.objectContaining({
                        owner: 'mallionaire',
                        title: 'Agricola',
                        review_id: 1,
                        category: 'euro game',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        created_at: '2021-01-18T10:00:20.514Z',
                        votes: 1,
                        designer: 'Uwe Rosenberg',
                        review_body: 'Farmyard fun!'
                })
            )
        })
    })
    test('Error 404 when review_id does not exist', ()=>{
        return request(app)
        .get('/api/reviews/20')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Review ID does not exist')
        })
    })
    test('Error 400 when review_id is not a valid input', ()=>{
        return request(app)
        .get('/api/reviews/badrequest')
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
})


describe('GET /api/reviews/:review_id/comments', ()=>{
    test('responds with status 200 and an array of comments', () =>{
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then((res)=>{
            expect(Object.keys(res.body.review_comments).length).toBe(3)
            res.body.review_comments.forEach((comment)=>{   
            expect(comment).toEqual(
                expect.objectContaining({
                        comment_id: expect.any(Number),
                        review_id: 2,
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String)
                })
            )
            })
        })
    })
    test('responds with the comments with most recent first', ()=>{
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then((res)=>{
            expect(res.body.review_comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('responds with empty array when a valid review id with no comments is entered', ()=>{
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then((res)=>{
            expect(res.body.review_comments).toEqual([])
        })
    })
    test('responds with 404 when invalid review id entered', ()=>{
        return request(app)
        .get('/api/reviews/20/comments')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Review ID does not exist')
        })
    })
    test('responds with 400 when bad request made', ()=>{
        return request(app)
        .get('/api/reviews/badrequest/comments')
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })

})


describe('POST /api/reviews/:review_id/comments', ()=>{
    test('responds with status 201 and the comment belonging to the user', ()=>{
        const user={
            username: 'bainesface',
            body: 'Not quite Yorkshire enough for me'
        }
        return request(app)
        .post('/api/reviews/10/comments')
        .send(user)
        .expect(201)
        .then((res)=>{
            expect(res.body.review_comments).toEqual(
                expect.objectContaining({
                    comment_id: 7,
                    body: 'Not quite Yorkshire enough for me',
                    votes: 0,
                    author: 'bainesface',
                    review_id: 10,
                    created_at: expect.any(String),
                })
            )
        })
    })
    test('responds with status 201, ignoring any additional keys in user object', ()=>{
        const user={
            username: 'bainesface',
            body: 'Not quite Yorkshire enough for me',
            age: 47
        }
        return request(app)
        .post('/api/reviews/10/comments')
        .send(user)
        .expect(201)
        .then((res)=>{
            expect(Object.keys(res.body.review_comments).length).toBe(6)
            expect(res.body.review_comments.age).toBe(undefined)
    })
})
    test('Responds with status 400 when malformed body entered', ()=>{
        const user={}
        return request(app)
        .post('/api/reviews/1/comments')
        .send(user)
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
    test('Responds with 404 when invalid username entered', ()=>{
        const user={
            username: 'treetrunk',
            body: 'Not quite Yorkshire enough for me'
        }
        return request(app)
        .post('/api/reviews/10/comments')
        .send(user)
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Not found')
        })
    })
    test('responds with 404 when a valid id is entered but not found', ()=>{
        const user={
            username: 'bainesface',
            body: 'You just lost the game'
        }
        return request(app)
        .post('/api/reviews/20/comments')
        .send(user)
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Not found')
        })
    })
    test('responds with 400 when an invalid id is entered', ()=>{
        const user={
            username: 'bainesface',
            body: 'You just lost the game'
        }
        return request(app)
        .post('/api/reviews/notanid/comments')
        .send(user)
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
})

describe('PATCH /api/reviews/:review_id', ()=>{
    test('responds status 200 and the updated review', ()=>{
        const updateVotes={
            inc_votes: 10
        }
        return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(200)
        .then((res)=>{
            expect(res.body.review).toEqual(
                expect.objectContaining({
                        owner: 'mallionaire',
                        title: 'Agricola',
                        review_id: 1,
                        category: 'euro game',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        created_at: '2021-01-18T10:00:20.514Z',
                        votes: 11,
                        designer: 'Uwe Rosenberg',
                        review_body: 'Farmyard fun!'
                })
            )
        })
    })
    test('responds status 200, decreasing the votes by value entered', ()=>{
        const updateVotes={
            inc_votes: -10
        }
        return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(200)
        .then((res)=>{
            expect(res.body.review.votes).toBe(-9)
        })
    })
    test('responds status 200, ignoring additional keys entered in request body',()=>{
        const updateVotes={
            inc_votes: 7,
            ignore: 'HELLO'
        }
        return request(app)
        .patch('/api/reviews/2')
        .send(updateVotes)
        .expect(200)
        .then((res)=>{
            expect(res.body.review.votes).toBe(12)
            expect(res.body.review.ignore).toBe(undefined)
        })
    })
    test('responds 400 bad request when malformed body entered', ()=>{
        const updateVotes={}
        return request(app)
        .patch('/api/reviews/2')
        .send(updateVotes)
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
    test('responds 400 bad request when incorrect data type entered', ()=>{
        const updateVotes={
            inc_votes: 'ten'
        }
        return request(app)
        .patch('/api/reviews/2')
        .send(updateVotes)
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
    test('responds with 404 when a valid id is entered but not found', ()=>{
        const updateVotes={
            inc_votes: 10
        }
        return request(app)
        .patch('/api/reviews/20')
        .send(updateVotes)
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Review ID does not exist')
        })
    })
    test('responds with 400 when an invalid id is entered', ()=>{
        const updateVotes={
            inc_votes: 10
        }
        return request(app)
        .patch('/api/reviews/notanid')
        .send(updateVotes)
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Bad request!')
        })
    })
})

describe('GET /api/users',()=>{
    test('responds with an array of user objects with correct keys', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((res)=>{
            expect(res.body.users).toHaveLength(4)
            res.body.users.forEach((user)=>{
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    })
})

describe('GET /api/reviews (queries)', ()=>{
    test('Responds with status 200 and returns the category specified', ()=>{
        return request(app)
        .get('/api/reviews?category=social deduction')
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toHaveLength(11)
            res.body.reviews.forEach((review)=>{
                expect(review).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: 'social deduction',
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })
    test('Responds with status 200 and returns empty array when no reviews correspond to category', ()=>{
        return request(app)
        .get(`/api/reviews?category=children's games`)
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toEqual([])
        })
    })
    test('Responds with status 200, returning sorted list', ()=>{
        return request(app)
        .get('/api/reviews?sort_by=votes')
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toHaveLength(13)
            expect(res.body.reviews).toBeSortedBy('votes', {descending: true})
        })
    })
    test('Responds with status 200, returning ordered list', ()=>{
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toBeSortedBy('created_at', {ascending: true})
        })
    })
    test('Responds with status 200 and accepts multiple queries', ()=>{
        return request(app)
        .get("/api/reviews?category=social deduction&sort_by=votes&order=asc")
        .expect(200)
        .then((res)=>{
            expect(res.body.reviews).toHaveLength(11)
            expect(res.body.reviews).toBeSortedBy('votes', {ascending: true})
            res.body.reviews.forEach((review)=>{
                expect(review.category).toBe('social deduction')
            })
        })
    })
    test('Responds with status 404 when category name doesnt exist', ()=>{
        return request(app)
        .get("/api/reviews?category=socialdeduction")
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('Category not found')
        })
    })
    test('Responds with status 400 when sort_by column name doesnt exist', ()=>{
        return request(app)
        .get("/api/reviews?sort_by=notacolumn")
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Invalid column')
        })
    })
    test('Responds with status 400 when order entered is invalid', ()=>{
        return request(app)
        .get("/api/reviews?order=name")
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Invalid order')
        })
    })
    test('Responds with status 400 when query spelt incorrectly', ()=>{
        return request(app)
        .get('/api/reviews?category=dexterity&oder=asc')
        .expect(400)
        .then((res)=>{
            expect(res.body.msg).toBe('Invalid query')
        })
    })
})


describe('General error handling', ()=>{
    test('responds with route not found when api address spelt wrong', ()=>{
        return request(app)
        .get('/api/categries')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toEqual('Route not found')
        })
    })
})