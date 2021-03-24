pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address author;
    }

    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address author
    );

    constructor() public {
        name = "My Social Network";
    }

    function createPost(string memory _content) public {
        //require valid content
        require(bytes(_content).length ;
        //increment post count
        postCount++;
        //cretae post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        //Trigger event
        emit PostCreated(postCount, "This is my first post", 0, msg.sender);
    }
}
//must create posts
//list all the post
//tip the posts
