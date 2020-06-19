import { Post } from "../resources/post/post.model";
import { User } from "../resources/user/user.model";

const sampleUser = {
  email: "user@svelte.dev",
  password: "password",
  permissions: {
    createPost: true,
    editOwnPost: true,
    editAnyPost: false,
    deleteOwnPost: true,
    deleteAnyPost: false,
  },
};

const sampleAdmin = {
  email: "admin@svelte.dev",
  password: "password",
  avatar: "admin.png",
  permissions: {
    createPost: true,
    editOwnPost: true,
    editAnyPost: true,
    deleteOwnPost: true,
    deleteAnyPost: true,
  },
};

let sampleUserPosts = [
  {
    title: "What is this template for?",
    slug: "what-is-sapper-graphql-template",
    html: `
			<p>I made this template so I can use it to scaffold projects easily. I'm sharing it because it might be of use to other developers as well.
			</p>
			<p>
				It allows you to use GraphQL with NextJS. It supports server side rendering as well. See the <a href="https://github.com/EddyVinck/nextjs-graphql-template"><code>eddyvinck/nextjs-graphql-template</code> repository on GitHub</a>.
			</>
			<p>🐦 Please follow me on Twitter: <a href="https://twitter.com/Veinq_" target="_blank" rel="noopener">@veinq_</a> for updates. I also post a lot about a lot of web development related things that might interest you.</p>
			<p>Thanks for checking it out!</p>
			<p>- Eddy</p>
		`,
  },
];

let sampleAdminPosts = [
  {
    title: "Admins are the best",
    html: "<p>It's true.</p>",
    isFeatured: true,
  },
];

const createSamplePosts = async (users) => {
  console.log("🛠 Creating a few posts...");
  const user = users.find((u) => u.email === sampleUser.email);
  const admin = users.find((u) => u.email === sampleAdmin.email);
  sampleUserPosts = sampleUserPosts.map((post) => ({
    ...post,
    author: user._id,
  }));
  sampleAdminPosts = sampleAdminPosts.map((post) => ({
    ...post,
    author: admin._id,
  }));
  const posts = await Post.create([...sampleUserPosts, ...sampleAdminPosts]);
};

async function getSampleUsers() {
  const users = await User.find({
    email: {
      $in: [sampleUser.email, sampleAdmin.email],
    },
  }).exec();

  return users;
}
const usersFoundMessage =
  '⭐ You can log in with "user@svelte.dev" or "admin@svelte.dev". Their passwords are "password".';

// ! Only run this in development and when the database is connected !
export async function createSampleDataIfDbEmpty() {
  try {
    console.log("🔎 Checking if database empty...");
    let sampleAccounts = await getSampleUsers();

    if (sampleAccounts.length > 0) {
      console.log("✔ Example users found!");
      console.log(usersFoundMessage);

      const posts = await Post.find({
        author: {
          $in: sampleAccounts.map((acc) => acc._id),
        },
      });

      if (posts.length > 0) {
        console.log(`✔ ${posts.length} example posts found!`);
        // if  the found users have any posts, stop running this function
        return;
      }
      await createSamplePosts(sampleAccounts);
      console.log("✔ Posts created!");

      return;
    }

    // If no users present, create a few users
    console.log("🛠 Creating a few users...");
    await User.create([sampleUser, sampleAdmin]);
    sampleAccounts = await getSampleUsers();
    console.log("✔ created sample user and admin!");
    console.log(usersFoundMessage);
    const posts = await createSamplePosts(sampleAccounts);
    console.log("✔ Posts created!");

    return console.log("✔ createSampleDataIfDbEmpty done!");
  } catch (error) {
    console.error(
      "Something went wrong in `createSampleDataIfDbEmpty`: ",
      error
    );
  }
}
