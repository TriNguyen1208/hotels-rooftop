📌 Ví dụ về dữ liệu trước và sau khi populate
Giả sử dữ liệu trong collection Comment như sau:
[
  {
    "_id": "65a123456789abcdef000001",
    "postId": "65a987654321abcdef000002",
    "user": "65a999999999abcdef000003",
    "content": "Bài viết hay quá!"
  }
]
Và trong collection User có:
{
  "_id": "65a999999999abcdef000003",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashedpassword123"
}
Nếu chỉ dùng find(), bạn sẽ nhận được:
[
  {
    "_id": "65a123456789abcdef000001",
    "postId": "65a987654321abcdef000002",
    "user": "65a999999999abcdef000003",
    "content": "Bài viết hay quá!"
  }
]
Nhưng nếu dùng .populate("user", "username email"), kết quả sẽ là:
[
  {
    "_id": "65a123456789abcdef000001",
    "postId": "65a987654321abcdef000002",
    "user": {
      "_id": "65a999999999abcdef000003",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "content": "Bài viết hay quá!"
  }
]