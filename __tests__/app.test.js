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
            expect(res.body.reviews).toBeSortedBy('created_at', {descending: true, coerce: true})
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