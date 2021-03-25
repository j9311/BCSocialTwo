pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address payable author;
    }

    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address author
    );

    event PostTipped(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    constructor() public {
        name = "My Social Network";
    }

    function createPost(string memory _content) public {
        //require valid content
        require(bytes(_content).length > 0);
        //increment post count
        postCount++;
        //cretae post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        //Trigger event
        emit PostCreated(postCount, "This is my first post", 0, msg.sender);
    }

    function tipPost(uint256 _id) public payable {
        //Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        //fetch post
        Post memory _post = posts[_id];
        //fetch the author
        address payable _author = _post.author;
        //pay the author
        address(_author).transfer(msg.value);
        //increment tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        //update post
        posts[_id] = _post;
        //trigger the event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}
//must create posts
//list all the post
//tip the posts
