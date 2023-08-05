class ChatController {
  renderChat(req, res) {
    return res.status(200).render("chat", {});
  }
}

export const chatController = new ChatController();
