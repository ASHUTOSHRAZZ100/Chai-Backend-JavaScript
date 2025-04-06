// // Import required libraries
// import mongoose from "mongoose";
// import faker from "faker";
// import { DB_NAME } from "../constants.js";
// import { Comment } from "../models/comments.models.js";
// import { Likes } from "../models/likes.models.js";
// import { Playlist } from "../models/playlists.models.js";
// import { Subscription } from "../models/subscription.models.js";
// import { Tweet } from "../models/tweets.models.js";
// import { User } from "../models/user.models.js";
// import { Video } from "../models/video.models.js";

// // console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
// // Connect to MongoDB
// (async () => {
//   await mongoose
//     // .connect(`mongodb://localhost:27017/${DB_NAME}`)
//     .then(() => {
//       console.log("Connected to MongoDB");
//     })
//     .catch((err) => {
//       console.error("Error connecting to MongoDB:", err);
//     });
// })();

// // Define Mongoose models
// // const User = mongoose.model('User', userSchema);
// // const Video = mongoose.model('Video', videoSchema);
// // const Comment = mongoose.model('Comment', commeentSchema);
// // const Subscription = mongoose.model('Subscription', subscriptionSchema);
// // const Playlist = mongoose.model('Playlist', playlistSchema);
// // const Like = mongoose.model('Like', likesSchema);
// // const Tweet = mongoose.model('Tweet', tweetSchema);

// // Function to generate mock data
// const generateData = async () => {
//   try {
//     // Clear existing data
//     await User.deleteMany();
//     console.log("User deleted");
//     await Video.deleteMany();
//     console.log("Video deleted");

//     await Comment.deleteMany();
//     console.log("Comment deleted");

//     await Subscription.deleteMany();
//     console.log("Subscription deleted");

//     await Playlist.deleteMany();
//     console.log("Playlist deleted");

//     await Likes.deleteMany();
//     console.log("Likes deleted");

//     await Tweet.deleteMany();
//     console.log("Tweet deleted");

//     // Create users
//     const users = [];
//     console.log("User start");
//     for (let i = 0; i < 200; i++) {
//       const user = new User({
//         username: faker.internet.userName().toLowerCase(),
//         email: faker.internet.email().toLowerCase(),
//         fullname: faker.name.findName(),
//         avatar: faker.image.avatar(),
//         coverImage: faker.image.imageUrl(),
//         password: "password",
//         // refreshToken: faker.datatype.uuid(),
//       });
//       await user.save();
//     //   console.log(user);
//       users.push(user);
//     }
//     console.log("User end");

//     // Create videos
//     const videos = [];
//     console.log("Video start");

//     for (let i = 0; i < 800; i++) {
//       const video = new Video({
//         videoFile: faker.internet.url(),
//         thumbnail: faker.image.imageUrl(),
//         description: faker.lorem.sentence(),
//         title: faker.lorem.words(3),
//         duration: faker.datatype.number({ min: 60, max: 600 }),
//         views: faker.datatype.number({ min: 0, max: 100000 }),
//         videoPublicId: faker.datatype.uuid(),
//         thumbnailPublicId: faker.datatype.uuid(),
//         owner: faker.random.arrayElement(users)._id,
//       });
//       await video.save();
//     //   console.log(video);
//       videos.push(video);
//     }
//     console.log("Video End");

//     console.log("Comment Start");
//     // Create comments
//     const comments = [];
//     for (let i = 0; i < 300; i++) {
//       const comment = new Comment({
//         content: faker.lorem.sentence(),
//         video: faker.random.arrayElement(videos)._id,
//         owner: faker.random.arrayElement(users)._id,
//       });
//       await comment.save();
//     //   console.log(comment);
//       comments.push(comment);
//     }
//     console.log("Comment End");

//     // Create subscriptions
//     console.log("Subscription Start");
//     for (let i = 0; i < 500; i++) {
//       const subscription = new Subscription({
//         subscriber: faker.random.arrayElement(users)._id,
//         channel: faker.random.arrayElement(users)._id,
//       });
//       await subscription.save();
//     }
//     console.log("Subbscription End");

//     // Create playlists
//     console.log("playlist Start");
//     for (let i = 0; i < 100; i++) {
//       const playlist = new Playlist({
//         name: faker.lorem.words(2),
//         description: faker.lorem.sentence(),
//         videos: faker.random.arrayElements(videos, 3).map((video) => video._id),
//         owner: faker.random.arrayElement(users)._id,
//       });
//       await playlist.save();
//     }
//     console.log("playlist End");

//     // Create tweets
//     console.log("Tweet Start");

//     for (let i = 0; i < 100; i++) {
//       const tweet = new Tweet({
//         owner: faker.random.arrayElement(users)._id,
//         content: faker.lorem.sentence(),
//       });
//       await tweet.save();
//     }
//     console.log("Tweet End");

//     // Create likes
//     console.log("Like Start");

//     for (let i = 0; i < 300; i++) {
//       const like = new Likes({
//         comment: faker.random.arrayElement(comments)._id,
//         video: faker.random.arrayElement(videos)._id,
//         likeBy: faker.random.arrayElement(users)._id,
//       });
//       await like.save();
//     }
//     console.log("Like End");

//     console.log("Mock data generated successfully!");
//     mongoose.disconnect();
//   } catch (err) {
//     console.error("Error generating mock data:", err);
//     mongoose.disconnect();
//   }
// };

// generateData();
