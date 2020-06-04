const fs = require("fs").promises;
const { promisify } = require("util");
const frontMatterParser = require("parser-front-matter");
const lunrjs = require("lunr");
const readdirp = require("readdirp");

const parse = promisify(frontMatterParser.parse.bind(frontMatterParser));

async function loadPostsWithFrontMatter(postsDirectoryPath) {
  // We read the content directory, but avoid indexing of these directories:
  // .DS_Store, old.
  const postEntryInfos = await readdirp.promise(postsDirectoryPath, {
    fileFilter: ["!.DS_Store", "!_index.md", "!*.jpg", "!*.svg", "!*.png"],
    directoryFilter: "!old",
  });
  // We take each post and map their paths.
  const postNames = postEntryInfos.map((file) => file.path);
  // To debug index building, un-comment the following line to get a list of
  // postNames. Do NOT keep it un-commented or the search will fail.
  // console.error(postNames);
  const posts = await Promise.all(
    postNames.map(async (fileName) => {
      const fileContent = await fs.readFile(
        `${postsDirectoryPath}/${fileName}`,
        "utf8"
      );
      const { content, data } = await parse(fileContent);
      return {
        // we only take a 10,000 character slice of the post to index. this ensures
        // our index doesn't grow too large
        content: content.slice(0, 10000),
        ...data,
      };
    })
  );
  return posts;
}

function makeIndex(posts) {
  return lunrjs(function () {
    // list of fields we are gathering from each post. we use the Title as our
    // reference marker (identifying feature)
    this.ref("title");
    this.field("title");
    // this.field('authors');
    // this.field('date');
    this.field("content");
    this.field("tags");
    // this.field('resources.src');
    // this.field('imageDescription')
    posts.forEach((p) => {
      this.add(p);
    });
  });
}

async function run() {
  // The following line specifies which directory to use for indexing. See above
  // for excluded directories and filetypes.
  const posts = await loadPostsWithFrontMatter(`${__dirname}/../content/`);
  const index = makeIndex(posts);
  // console.log(JSON.stringify(index));
  return JSON.stringify(index);
}

// run()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error.stack);
//     process.exit(1);
//   });

exports.run = run;
