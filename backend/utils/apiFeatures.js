class ApiFeatures{
    constructor(query , queryStr) {
        this.query = query
        this.queryStr = queryStr
    }



    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                //case insenitive
                $options : "i",
            }
        } : {}

        // console.log(keyword)
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        //actual copy bani h ab reference nhi
        const queryCopy = {...this.queryStr}
        const removeFiels = ["keyword" , "page" , "limit"];
        removeFiels.forEach(key => delete queryCopy[key]);

        //filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g  , (key) => `$${key}`);

        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        
    }

    pagination(){
        
    }


}

module.exports = {ApiFeatures}