const  mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;

class Post { // class can be used to group multiple functionalities together
  constructor(title, content, id) { 
    // special method which contains code that will be executed when called
    // - an concreate object
    this.title = title;
    this.content = content;

    if (id) {
      this.id = new ObjectId(id); // this set the id only if gets one from the db
    }
  }

// STATIC METHOD - isnt called on the object, but on the class itself
  static async fetchAll(){ // for all posts
    const posts = await db.getDb().collection('posts').find().toArray();
    return posts;
  };

  async fetch() { // for single post
    if (!this.id) {
      return
    }
    // to populate the blueprint from Post class 
    const postDocument = await db.getDb().collection('posts').findOne({ _id: this.id });
    this.title = postDocument.title;
    this.content = postDocument.content;

  }

  async save() {
    let result; // this is needed for use on if/else statement

    if (this.id) { // if have id, then UPDATE the post
      result = await db
        .getDb()
        .collection('posts')
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    } else { // if dont have an id, then CREATE the post
      result = await db.getDb().collection('posts').insertOne({
        title: this.title,
        content: this.content,
    });
    }

    return result;
    }

    async delete() { // for DELETE the post
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