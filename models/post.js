const  mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;

class Post {
  constructor(title, content, id) { 
    // special method which contains code that will be executed when called
    // - an concreate object
    this.title = title;
    this.content = content;

    if (id) {
      this.id = new ObjectId(id); // this set the id only if gets one from the db
    }
  }

  async save() {
    let result;

    if (this.id) { // if have id, then update the post
      result = await db
        .getDb()
        .collection('posts')
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    } else { // if dont have an id, then create the post
      result = await db.getDb().collection('posts').insertOne({
        title: this.title,
        content: this.content,
    });
    }

    return result;
    }

    async delete() {
      if (!this.id){ // if dont have an id
        return;
      }
      const result = await db
      .getDb()
      .collection('posts')
      .deleteOne({ _id: this.id });
      return result;
    }
}

module.exports = Post;