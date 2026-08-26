class PostModel
{
    constructor(id, name, price, description, category, status, expire, image, question){
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.status = status;
        this.expire = expire;
        this.image = image;
        this.question = question;
    }
}

export default PostModel;