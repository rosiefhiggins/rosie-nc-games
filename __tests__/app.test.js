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
    test('responds with route not found when api address spelt wrong', ()=>{
        return request(app)
        .get('/api/categries')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toEqual('Route not found')
        })
    })
})

describe('GET /api/reviews', ()=>{
    test('responds with staus code 200', ()=>{
        return request(app)
        .get('/api/reviews')
        .expect(200)
    })
    test('responds with an array of review objects', ()=>{
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
    test('responds with route not found when api address spelt wrong', ()=>{
        return request(app)
        .get('/api/review')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toEqual('Route not found')
        })
    })
})


