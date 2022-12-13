const db=require('../db/connection')

exports.checkIfIDExists=(id)=>{
    return db.query(`SELECT * FROM reviews WHERE review_id=$1;`, [id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({status:404, msg: 'Review ID does not exist'})
        }else{
            return true
        }
    })
}