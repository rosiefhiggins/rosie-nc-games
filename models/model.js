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