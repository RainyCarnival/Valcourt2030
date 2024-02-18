const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema({
	// TODO: Figure out what fields will be needed for this schema
});

module.exports = mongoose.model('Events', EventsSchema);

// TODO: Example Post
// {
//     "post_id":1234,
//     "post":{
//         "ID":1,
//         "post_author":"1",
//         "post_date":"2018-11-06 14:19:18",
//         "post_date_gmt":"2018-11-06 14:19:18",
//         "post_content":"Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
//         "post_title":"Hello world!",
//         "post_excerpt":"",
//         "post_status":"publish",
//         "comment_status":"open",
//         "ping_status":"open",
//         "post_password":"",
//         "post_name":"hello-world",
//         "to_ping":"",
//         "pinged":"",
//         "post_modified":"2018-11-06 14:19:18",
//         "post_modified_gmt":"2018-11-06 14:19:18",
//         "post_content_filtered":"",
//         "post_parent":0,
//         "guid":"https://mydomain.dev/?p=1",
//         "menu_order":0,
//         "post_type":"post",
//         "post_mime_type":"",
//         "comment_count":"1",
//         "filter":"raw"
//     },
//     "post_meta":{
//         "key_0":["0.00"],
//         "key_1":["0"],
//         "key_2":["1"],
//         "key_3":["148724528:1"],
//         "key_4":["10.00"],
//         "key_5":["a:0:{}"]
//     },
//     "post_thumbnail":"https://mydomain.com/images/image.jpg",
//     "post_permalink":"https://mydomain.com/the-post/permalink",
//     "taxonomies":{
//         "category":{
//             "uncategorized":{
//                 "term_id":1,
//                 "name":"Uncategorized",
//                 "slug":"uncategorized",
//                 "term_group":0,
//                 "term_taxonomy_id":1,
//                 "taxonomy":"category",
//                 "description":"",
//                 "parent":10,
//                 "count":7,
//                 "filter":"raw"
//             },
//             "secondcat":{
//                 "term_id":2,
//                 "name":"Second Cat",
//                 "slug":"secondcat",
//                 "term_group":0,
//                 "term_taxonomy_id":2,
//                 "taxonomy":"category",
//                 "description":"",
//                 "parent":1,
//                 "count":1,
//                 "filter":"raw"
//             }
//         }
//     }
// }