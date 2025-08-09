const errorHandler = (error, req, res, next) => {
  console.log({ error });

  if (error.name == "CustomError") {
    res.status(error.statusCode).json({ success: false, error: error.message });
  }
  if (error.message.includes("destructure property")) {
    res
      .status(400)
      .json({ success: false, error: "missing parameters in body" });
  }
  if (
    error.code == "ER_DUP_ENTRY" &&
    error.sqlMessage.includes("for key 'email")
  ) {
    res.status(400).json({ success: false, error: "email already exists!" });
  }
  if (error.code == "ER_NO_REFERENCED_ROW_2") {
    const match = error.sqlMessage.match(/FOREIGN KEY \(`([^`]+)`\)/);    
    res.status(404).json({ success: false, error: `${match[1]} not found` });
  }
  if ((error.type = "entity.parse.failed")) {
    res.status(400).json({ success: false, error: error.message });
  }
  res.status(500).json({ success: false, error: error.message });
};

export default errorHandler;
