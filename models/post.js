const db = require('../data/database');

class Post {
  constructor(title, content, id) { 
    // special method which contains code that will be executed when called
    // - an concreate object
    this.title = title;
    this.content = content;
    this.id = id; // may be undefined
  }

  async save() {
    const result = await db.getDb().collection('posts').insertOne({
      title: this.title,
      content: this.content,
    }
    );

    return result;
  }
}

module.exports = Post;