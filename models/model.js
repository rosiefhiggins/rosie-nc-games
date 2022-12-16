const db=require('../db/connection')

exports.selectCategories=()=>{
    return db.query('SELECT * FROM categories;').then((result)=>{
        return result.rows
    })
}

exports.selectReviews= (category, sort_by='created_at', order='desc') =>{
    const validColumns=['review_id', 'title', 'category', 'designer', 'owner', 'review_img_url', 'created_at', 'votes', 'comment_count']
    const validOrders=['asc', 'desc']
    const queryValues=[]
    if(validOrders.indexOf(order)===-1){
        return Promise.reject({status: 400, msg: 'Invalid order'})
    }
    if(validColumns.indexOf(sort_by)===-1){
        return Promise.reject({status: 400, msg: 'Invalid column'})
    }
    let queryStr=`SELECT reviews.review_id, title, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id=reviews.review_id `
    if(category===undefined){
        queryStr+=`GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
    } else{
        const validCategories=['euro game', 'social deduction', "children's games", 'dexterity']
        if(validCategories.indexOf(category)===-1){
            return Promise.reject({status: 404, msg: 'Category not found'})
        }
        queryStr+=`WHERE category=$1 GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
        queryValues.push(category)
    }
    return db.query(queryStr, queryValues).then((result)=>{
        return result.rows
    })
 }

 exports.selectReviewByID=(id)=>{
    return db.query(`SELECT reviews.review_id, title, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, review_body, COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id=reviews.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;`, [id]).then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({status:404, msg: 'Review ID does not exist'})
        } else{
            return result.rows[0]
        }      
    })
 }

 exports.selectCommentsByReviewID=(id)=>{
    return db.query(`SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at desc;`, [id]).then((result)=>{
        return result.rows
    })
 }

 exports.insertComment=(id, username, body)=>{
    return db.query("INSERT INTO comments (body, review_id, author) VALUES ($1,$2,$3) RETURNING *;", [body, id, username]).then(({rows})=>{
        return rows[0]
    })
 }

 exports.updateVotes=(id, newVote)=>{
    return db.query("UPDATE reviews SET votes=votes+$1 WHERE review_id=$2 RETURNING *;", [newVote, id]).then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({status:404, msg: 'Review ID does not exist'})
        } else{
            return result.rows[0]
    }      
 })
}

exports.selectUsers=()=>{
    return db.query("SELECT * FROM users;").then((result)=>{
        return result.rows
    })
}