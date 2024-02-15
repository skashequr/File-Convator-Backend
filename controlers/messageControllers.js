const expressAsyncHandler = require("express-async-handler");
const Message = require("../modals/messageModal");
const User = require("../modals/userModel");
const Chat = require("../modals/chatModals");

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.params.chatId);
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("reciever")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId , data } = req.body;
  console.log(data);
    // console.log(req.body);
    console.log(`content = ${content} chatId=${chatId}`);
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user?._id,
    content: content,
    chat: chatId,
    data: data
  };

  try {
    var message = await Message.create(newMessage);

    console.log(message);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("reciever");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };