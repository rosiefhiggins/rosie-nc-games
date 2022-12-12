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
            expect(Array.isArray(res.body)).toBe(true)
            res.body.forEach((category)=>{
                expect(typeof category).toBe('object')
            })
        })
    })
    test('responds with an array of objects', ()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res)=>{
            res.body.forEach((category)=>{
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