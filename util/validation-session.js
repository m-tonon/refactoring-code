function getSessionErrorData(req,defaultValues) {
  let sessionInputData = req.session.inputData;
  
    if (!sessionInputData) { 
      sessionInputData = {
        hasError: false,
        ...defaultValues // operator to spread that object into this new objetc
      };
    }
  
    req.session.inputData = null;

    return sessionInputData;
}

function flashErrorToSession(req, data, action){
  req.session.inputData = {
    hasError: true,
    ...data
  };

  req.session.save(action); // after saving is finished an action is executed
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorToSession: flashErrorToSession
};