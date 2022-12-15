const db=require('../db/connection')

exports.selectCategories=()=>{
    return db.query('SELECT * FROM categories;').then((result)=>{
        return result.rows
    })
}

exports.selectReviews= () =>{
    return db.query('SELECT reviews.review_id, title, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews JOIN comments ON comments.review_id=reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at desc;').then((result)=>{
            return result.rows
        })
 }

 exports.selectReviewByID=(id)=>{
    return db.query(`SELECT * FROM reviews WHERE review_id=$1;`, [id]).then((result)=>{
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