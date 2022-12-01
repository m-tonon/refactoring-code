function getSessionErrorData(req, defaultValues) {
  let sessionInputData = req.session.inputData;
  
    if (!sessionInputData) { 
      sessionInputData = {
        hasError: false,
        ...defaultValues //spread that in this object
      };
    }
  
    req.session.inputData = null;

    return sessionInputData;
}

function flashErrorsToSession(req, data, action){
  req.session.inputData = {
    hasError: true,
    ...data
  };

  req.session.save(action); // after saving is finished an action is executed
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorsToSession: flashErrorsToSession
};