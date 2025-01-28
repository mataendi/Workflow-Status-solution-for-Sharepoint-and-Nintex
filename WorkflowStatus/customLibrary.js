function retrieveItemsFiltered(
    siteURL,
    listName,
    fieldNames,
    fieldToFilter,
    valueToFilter,
    callback,
    finalCallback
  ) {
    var context = new SP.ClientContext(siteURL);
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listName);

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
      `<View><Query><Where><Eq><FieldRef Name='${fieldToFilter}'/><Value Type='Text'>${valueToFilter}</Value></Eq></Where></Query></View>`
    );
  
    var collListItem = list.getItems(camlQuery);
  
   
    context.load(collListItem, "Include(" + fieldNames.join(",") + ")");
  
    context.executeQueryAsync(
      function () {
        var array = [];
        var listItemEnumerator = collListItem.getEnumerator();
  
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var obj = {};
  
          for (var i = 0; i < fieldNames.length; i++) {
            obj[fieldNames[i]] = oListItem.get_item(fieldNames[i]);
          }
  
          array.push(obj);
        }
  
        if (callback && typeof callback === "function") {
          callback(array);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(true);
        }
      },
      function (sender, args) {
        console.error(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
        if (callback && typeof callback === "function") {
          callback([]);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(false);
        }
      }
    );
  }
  
  function new_retrieveItemsFiltered(
    siteURL,
    listName,
    fieldNames,
    fieldToFilter,
    valueToFilter,
    callback,
    finalCallback
  ) {
    var context = new SP.ClientContext(siteURL);
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listName);
  
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
      `<View><Query><Where><Eq><FieldRef Name='${fieldToFilter}'/><Value Type='Text'>${valueToFilter}</Value></Eq></Where></Query></View>`
    );
  
    var collListItem = list.getItems(camlQuery);
  
    context.load(collListItem, "Include(" + fieldNames.join(",") + ")");
  
    context.executeQueryAsync(
      function () {
        var array = [];
        var listItemEnumerator = collListItem.getEnumerator();
  
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var obj = {};
  
          for (var i = 0; i < fieldNames.length; i++) {
            var fieldName = fieldNames[i];
            var fieldValue = oListItem.get_item(fieldName);
  
    
            if (fieldValue instanceof SP.FieldUserValue) {
              
              fieldValue = fieldValue.get_lookupValue();
            }
  
            obj[fieldName] = fieldValue;
          }
  
          array.push(obj);
        }
  
        if (callback && typeof callback === "function") {
          callback(array);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(true);
        }
      },
      function (sender, args) {
        console.error(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
        if (callback && typeof callback === "function") {
          callback([]);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(false);
        }
      }
    );
  }
  
  
  function retrieveItems(siteURL, listName, fieldNames, callback, finalCallback) {
    var context = new SP.ClientContext(siteURL);
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listName);
    var query = SP.CamlQuery.createAllItemsQuery();
    var collListItem = list.getItems(query);
    context.load(collListItem);
  
    context.executeQueryAsync(
      function () {
        var array = [];
        var listItemEnumerator = collListItem.getEnumerator();
  
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var obj = {};
  
          for (var i = 0; i < fieldNames.length; i++) {
            obj[fieldNames[i]] = oListItem.get_item(fieldNames[i]);
          }
  
          array.push(obj);
        }
  
        if (callback && typeof callback === "function") {
          callback(array);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(true); 
        }
  
      },
      function (sender, args) {
        console.error(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
        if (callback && typeof callback === "function") {
          callback([]);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(false);
        }
      }
    );
  }
  
  
  function new_retrieveItems(siteURL, listName, fieldNames, callback, finalCallback, errorCallback) {
    var context = new SP.ClientContext(siteURL);
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listName);
    var query = SP.CamlQuery.createAllItemsQuery();
    var collListItem = list.getItems(query);
    context.load(collListItem);
  
    context.executeQueryAsync(
      function () {
        var array = [];
        var listItemEnumerator = collListItem.getEnumerator();
  
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var obj = {};
  
          for (var i = 0; i < fieldNames.length; i++) {
            var fieldName = fieldNames[i];
            var fieldValue = oListItem.get_item(fieldName);
  
          
            if (fieldValue instanceof SP.FieldUserValue) {
        
              fieldValue = fieldValue.get_lookupValue();
            }
  
            obj[fieldName] = fieldValue;
          }
  
          array.push(obj);
        }
  
        if (callback && typeof callback === "function") {
          callback(array);
        }
  
        if (finalCallback && typeof finalCallback === "function") {
          finalCallback(true);
        }
  
      },
      function (sender, args) {
        console.error(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
        if (errorCallback && typeof errorCallback === "function") {
          errorCallback(args.get_message(), args.get_stackTrace());
        } else {
          if (callback && typeof callback === "function") {
            callback([]);
          }
  
          if (finalCallback && typeof finalCallback === "function") {
            finalCallback(false);
          }
        }
      }
    );
  }
  async function asyncRetrieveItems(siteURL, listName, fieldNames) {
    return new Promise((resolve, reject) => {
        var context = new SP.ClientContext(siteURL);
        var web = context.get_web();
        var list = web.get_lists().getByTitle(listName);
        var query = SP.CamlQuery.createAllItemsQuery();
        var collListItem = list.getItems(query);
  
        context.load(collListItem, 'Include(' + fieldNames.join(',') + ')'); 
  
        context.executeQueryAsync(
            function () {
                var array = [];
                var listItemEnumerator = collListItem.getEnumerator();
  
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var obj = {};
  
                    for (var i = 0; i < fieldNames.length; i++) {
                        var fieldName = fieldNames[i];
                        var fieldValue = oListItem.get_item(fieldName);
  
                     
                        if (fieldValue instanceof SP.FieldUserValue) {
                    
                            fieldValue = fieldValue.get_lookupValue();
                        }
  
                        obj[fieldName] = fieldValue;
                    }
  
                    array.push(obj);
                }
  
                resolve(array);
            },
            function (sender, args) {
                console.error(
                    "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
                );
                reject(new Error(args.get_message()));
            }
        );
    });
  }
  
  async function addViewColumn(siteURL, listName, viewName, columnName) {
    try {
     
        const clientContext = new SP.ClientContext(siteURL);
  
       
        const olistCollection = clientContext.get_web().get_lists();
        const oList = olistCollection.getByTitle(listName);
  
      
        const oView = oList.get_views().getByTitle(viewName);
  
       
        const viewFields = oView.get_viewFields();
        clientContext.load(viewFields);
  
     
        await executeQueryAsync(clientContext);
  
       
        const fieldEnumerator = viewFields.getEnumerator();
        let fieldExists = false;
        while (fieldEnumerator.moveNext()) {
            if (fieldEnumerator.get_current() === columnName) {
                fieldExists = true;
                break;
            }
        }
  

        if (!fieldExists) {
            viewFields.add(columnName);
            oView.update();
  

            await executeQueryAsync(clientContext);
            console.log('Column added successfully');
        } else {
            console.log('Column already exists in the view');
        }
    } catch (err) {
        console.error('Failed: ' + err.message + '\n' + err.stack);
    }
  }
  
  function executeQueryAsync(clientContext) {
    return new Promise((resolve, reject) => {
        clientContext.executeQueryAsync(
            () => resolve(),
            (sender, args) => reject(new Error(args.get_message() + '\n' + args.get_stackTrace()))
        );
    });
  }
  
  function recycleListItem(
    siteURL,
    listName,
    ID,
    successCallback,
    failureCallback
  ) {
    if (Array.isArray(ID)) {
 
      ID.forEach(function (itemId) {
        var clientContext = new SP.ClientContext(siteURL);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);
        var oListItem = oList.getItemById(itemId);
  
        oListItem.recycle();
  
        clientContext.executeQueryAsync(
          function () {
        
            if (successCallback && typeof successCallback === "function") {
              successCallback("Item deleted: " + itemId);
            }
          },
          function (sender, args) {
         
            if (failureCallback && typeof failureCallback === "function") {
              failureCallback(
                "Request failed for item " +
                  itemId +
                  ": " +
                  args.get_message() +
                  "\n" +
                  args.get_stackTrace()
              );
            }
          }
        );
      });
    } else {

      var itemId = ID;
  
      var clientContext = new SP.ClientContext(siteURL);
      var oList = clientContext.get_web().get_lists().getByTitle(listName);
      var oListItem = oList.getItemById(itemId);
  
      oListItem.recycle();
  
      clientContext.executeQueryAsync(
        function () {
    
          if (successCallback && typeof successCallback === "function") {
            successCallback("Item deleted: " + itemId);
          }
        },
        function (sender, args) {
      
          if (failureCallback && typeof failureCallback === "function") {
            failureCallback(
              "Request failed for item " +
                itemId +
                ": " +
                args.get_message() +
                "\n" +
                args.get_stackTrace()
            );
          }
        }
      );
    }
  }
  
  function deleteListItem(
    siteURL,
    listName,
    ID,
    successCallback,
    failureCallback
  ) {
    if (Array.isArray(ID)) {
  
      ID.forEach(function (itemId) {
        var clientContext = new SP.ClientContext(siteURL);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);
        var oListItem = oList.getItemById(itemId);
  
        oListItem.deleteObject();
  
        clientContext.executeQueryAsync(
          function () {
        
            if (successCallback && typeof successCallback === "function") {
              successCallback("Item deleted: " + itemId);
            }
          },
          function (sender, args) {
         
            if (failureCallback && typeof failureCallback === "function") {
              failureCallback(
                "Request failed for item " +
                  itemId +
                  ": " +
                  args.get_message() +
                  "\n" +
                  args.get_stackTrace()
              );
            }
          }
        );
      });
    } else {
     
      var itemId = ID;
  
      var clientContext = new SP.ClientContext(siteURL);
      var oList = clientContext.get_web().get_lists().getByTitle(listName);
      var oListItem = oList.getItemById(itemId);
  
      oListItem.deleteObject();
  
      clientContext.executeQueryAsync(
        function () {
         
          if (successCallback && typeof successCallback === "function") {
            successCallback("Item deleted: " + itemId);
          }
        },
        function (sender, args) {
      
          if (failureCallback && typeof failureCallback === "function") {
            failureCallback(
              "Request failed for item " +
                itemId +
                ": " +
                args.get_message() +
                "\n" +
                args.get_stackTrace()
            );
          }
        }
      );
    }
  }
  
  
  function getUserByEmail(email) {
    var context = SP.ClientContext.get_current();
    var web = context.get_web();
    var users = web.get_siteUsers();
    var user = users.getByEmail(email);
    context.load(user);
    context.executeQueryAsync(
      function () {
        alert(user.get_title());
        User = user;
      },
      function (sender, args) {
        alert("Something wrong happened. " + args.get_message());
      }
    );
  }
  
  function getUserByFullName(callback, fullName, filter) {
    var context = SP.ClientContext.get_current();
    var web = context.get_web();
  
    var user = web.ensureUser(fullName);
    context.load(user);
  
    var fullnames = {};
  
    context.executeQueryAsync(
      function () {
        var userProperties = user.get_objectData().get_properties();
  
        if (typeof filter === "string") {
          if (userProperties.hasOwnProperty(filter)) {
            fullnames[filter] = userProperties[filter];
          }
        } else if (Array.isArray(filter)) {
          for (var i = 0; i < filter.length; i++) {
            var property = filter[i];
            if (userProperties.hasOwnProperty(property)) {
              fullnames[property] = userProperties[property];
            }
          }
        } else {
       
          for (var key in userProperties) {
            if (userProperties.hasOwnProperty(key)) {
              fullnames[key] = userProperties[key];
            }
          }
        }
  
        callback(fullnames);
      },
      function (sender, args) {
        console.log("Error: " + args.get_message());
      }
    );
  }
  
  function site_getUserByFullName(site,callback, fullName, filter) {
    var context = new SP.ClientContext(site);
    var web = context.get_web();
  
    var user = web.ensureUser(fullName);
    context.load(user);
  
    var fullnames = {};
  
    context.executeQueryAsync(
      function () {
        var userProperties = user.get_objectData().get_properties();
  
        if (typeof filter === "string") {
          if (userProperties.hasOwnProperty(filter)) {
            fullnames[filter] = userProperties[filter];
          }
        } else if (Array.isArray(filter)) {
          for (var i = 0; i < filter.length; i++) {
            var property = filter[i];
            if (userProperties.hasOwnProperty(property)) {
              fullnames[property] = userProperties[property];
            }
          }
        } else {
       
          for (var key in userProperties) {
            if (userProperties.hasOwnProperty(key)) {
              fullnames[key] = userProperties[key];
            }
          }
        }
  
        callback(fullnames);
      },
      function (sender, args) {
        console.log("Error: " + args.get_message());
      }
    );
  }
  
  
  async function asyncGetUserByFullName(fullName, filter) {
    return new Promise((resolve, reject) => {
      var context = SP.ClientContext.get_current();
      var web = context.get_web();
  
      var user = web.ensureUser(fullName);
      context.load(user);
  
      var fullnames = {};
  
      context.executeQueryAsync(
        function () {
          var userProperties = user.get_objectData().get_properties();
  
          if (typeof filter === "string") {
            if (userProperties.hasOwnProperty(filter)) {
              fullnames[filter] = userProperties[filter];
            }
          } else if (Array.isArray(filter)) {
            for (var i = 0; i < filter.length; i++) {
              var property = filter[i];
              if (userProperties.hasOwnProperty(property)) {
                fullnames[property] = userProperties[property];
              }
            }
          } else {
       
            for (var key in userProperties) {
              if (userProperties.hasOwnProperty(key)) {
                fullnames[key] = userProperties[key];
              }
            }
          }
  
          resolve(fullnames);
        },
        function (sender, args) {
          reject("Error: " + args.get_message());
        }
      );
    });
  }
  
  
  
  
  
  function getUserProfileProperties(callback, fullName, filterKeys) {
    getUserByFullName(
      function (result) {
        var user = result;
        var accountName = user.LoginName;
  

        var siteUrl = "sharepointSite.com"
        var requestUrl =
          siteUrl +
          "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" +
          encodeURIComponent(accountName) +
          "'";
  
        $.ajax({
          url: requestUrl,
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
          success: function (data) {
            if (data && data.d && data.d.UserProfileProperties) {
              var userProfileProperties = data.d.UserProfileProperties.results;
              var userProperties = {};
  
              if (filterKeys) {
                if (Array.isArray(filterKeys)) {
                  filterKeys.forEach(function (key) {
                    var filteredProperty = userProfileProperties.find(function (
                      property
                    ) {
                      return property.Key === key;
                    });
  
                    if (filteredProperty) {
                      userProperties[key.replace(/-/g, "_")] =
                        filteredProperty.Value;
                    } else {
                      userProperties[key.replace(/-/g, "_")] =
                        "Filter key not found for account: " + fullName;
                    }
                  });
                } else if (typeof filterKeys === "string") {
                  var filteredProperty = userProfileProperties.find(function (
                    property
                  ) {
                    return property.Key === filterKeys;
                  });
  
                  if (filteredProperty) {
                    userProperties[filterKeys.replace(/-/g, "_")] =
                      filteredProperty.Value;
                  } else {
                    userProperties[filterKeys.replace(/-/g, "_")] =
                      "Filter key not found for account: " + fullName;
                  }
                }
              } else {
                userProfileProperties.forEach(function (property) {
                  userProperties[property.Key.replace(/-/g, "_")] =
                    property.Value;
                });
              }
  
    
              callback(userProperties);
            } else {
              callback(
                "User profile properties not found for account: " + fullName
              );
            }
          },
          error: function (error) {
            callback(
              "Error fetching user profile properties: " + JSON.stringify(error)
            );
          },
        });
      },
      fullName,
      "LoginName"
    );
  }
  
  async function async_getUserProfileProperties(fullName, filterKeys) {
    try {
      const user = await asyncGetUserByFullName(fullName, "LoginName");
      const accountName = user.LoginName;
  
      const siteUrl = "sharepointSite.com";
      const requestUrl =
        `${siteUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='${encodeURIComponent(accountName)}'`;
  
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.d && data.d.UserProfileProperties) {
        const userProfileProperties = data.d.UserProfileProperties.results;
        const userProperties = {};
  
        if (filterKeys) {
          if (Array.isArray(filterKeys)) {
            for (const key of filterKeys) {
              const filteredProperty = userProfileProperties.find(
                (property) => property.Key === key
              );
  
              userProperties[key.replace(/-/g, "_")] = filteredProperty
                ? filteredProperty.Value
                : `Filter key not found for account: ${fullName}`;
            }
          } else if (typeof filterKeys === "string") {
            const filteredProperty = userProfileProperties.find(
              (property) => property.Key === filterKeys
            );
  
            userProperties[filterKeys.replace(/-/g, "_")] = filteredProperty
              ? filteredProperty.Value
              : `Filter key not found for account: ${fullName}`;
          }
        } else {
          for (const property of userProfileProperties) {
            userProperties[property.Key.replace(/-/g, "_")] = property.Value;
          }
        }
  
        return userProperties;
      } else {
        throw new Error(
          `User profile properties not found for account: ${fullName}`
        );
      }
    } catch (error) {
      throw new Error(
        `Error fetching user profile properties: ${error.message}`
      );
    }
  }
  
  
  function site_getUserProfileProperties(site,callback, fullName, filterKeys) {
    site_getUserByFullName(
      site,
      function (result) {
        var user = result;
        var accountName = user.LoginName;
  
  
        var siteUrl = "sharepointSite.com"
        var requestUrl =
          siteUrl +
          "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" +
          encodeURIComponent(accountName) +
          "'";
  
        $.ajax({
          url: requestUrl,
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
          success: function (data) {
            if (data && data.d && data.d.UserProfileProperties) {
              var userProfileProperties = data.d.UserProfileProperties.results;
              var userProperties = {};
  
              if (filterKeys) {
                if (Array.isArray(filterKeys)) {
                  filterKeys.forEach(function (key) {
                    var filteredProperty = userProfileProperties.find(function (
                      property
                    ) {
                      return property.Key === key;
                    });
  
                    if (filteredProperty) {
                      userProperties[key.replace(/-/g, "_")] =
                        filteredProperty.Value;
                    } else {
                      userProperties[key.replace(/-/g, "_")] =
                        "Filter key not found for account: " + fullName;
                    }
                  });
                } else if (typeof filterKeys === "string") {
                  var filteredProperty = userProfileProperties.find(function (
                    property
                  ) {
                    return property.Key === filterKeys;
                  });
  
                  if (filteredProperty) {
                    userProperties[filterKeys.replace(/-/g, "_")] =
                      filteredProperty.Value;
                  } else {
                    userProperties[filterKeys.replace(/-/g, "_")] =
                      "Filter key not found for account: " + fullName;
                  }
                }
              } else {
                userProfileProperties.forEach(function (property) {
                  userProperties[property.Key.replace(/-/g, "_")] =
                    property.Value;
                });
              }
  
    
              callback(userProperties);
            } else {
              callback(
                "User profile properties not found for account: " + fullName
              );
            }
          },
          error: function (error) {
            callback(
              "Error fetching user profile properties: " + JSON.stringify(error)
            );
          },
        });
      },
      fullName,
      "LoginName"
    );
  }

  
  function createListItem(siteURL, listName, fieldNames, itemValues, successCallback) {
    var clientContext = new SP.ClientContext(siteURL);
    var oList = clientContext.get_web().get_lists().getByTitle(listName);
  
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);
  
    if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
      for (var i = 0; i < fieldNames.length; i++) {
        oListItem.set_item(fieldNames[i], itemValues[i]);
      }
    } else {
      console.error("Invalid input: Field names and values must be arrays of the same length.");
      return;
    }
  
    oListItem.update();
  
    clientContext.load(oListItem);
  
    clientContext.executeQueryAsync(
      function () {
        if (successCallback && typeof successCallback === 'function') {
          successCallback(oListItem);
        } else {
          createListItem_onQuerySucceeded(oListItem);
        }
      },
      function (sender, args) {
        createListItem_onQueryFailed(sender, args);
      }
    );
  }
  
  function createListItem_onQuerySucceeded(oListItem) {
    console.log("Item created");
  }
  
  function createListItem_onQueryFailed(sender, args) {
    console.error("Request failed. " + args.get_message() + "\n" + args.get_stackTrace());
  }
  
  async function async_createListItem(siteURL, listName, fieldNames, itemValues) {
    return new Promise((resolve, reject) => {
        var clientContext = new SP.ClientContext(siteURL);
        var oList = clientContext.get_web().get_lists().getByTitle(listName);
  
        var itemCreateInfo = new SP.ListItemCreationInformation();
        var oListItem = oList.addItem(itemCreateInfo);
  
        if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
            for (var i = 0; i < fieldNames.length; i++) {
                oListItem.set_item(fieldNames[i], itemValues[i]);
            }
        } else {
            return reject(new Error("Invalid input: Field names and values must be arrays of the same length."));
        }
  
        oListItem.update();
  
        clientContext.load(oListItem);
  
        clientContext.executeQueryAsync(
            function () {
                resolve(oListItem);
            },
            function (sender, args) {
                reject(new Error(args.get_message()));
            }
        );
    });
  }
  
  

  function createListItemCS(listName, fieldNames, itemValues, success, error) {
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle(listName);
  
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);
  
    if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
      for (var i = 0; i < fieldNames.length; i++) {
        oListItem.set_item(fieldNames[i], itemValues[i]);
      }
    } else {
      console.error("Invalid input: Field names and values must be arrays of the same length.");
      return;
    }
  
    oListItem.update();
  
    clientContext.load(oListItem);
  
    clientContext.executeQueryAsync(
      function () {
        if (success && typeof success === 'function') {
          success(oListItem.get_id());
        } else {
          createListItemCS_onQuerySucceeded.call({ oListItem: oListItem });
        }
      },
      function (sender, args) {
        if (error && typeof error === 'function') {
          error(sender, args);
        } else {
          createListItemCS_onQueryFailed(sender, args);
        }
      }
    );
  }
  
  function createListItemCS_onQuerySucceeded() {
    console.log("Item created: ");
  }
  
  function createListItemCS_onQueryFailed(sender, args) {
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
    );
  }
  
  function updateListItemCS(listName, id, fieldNames, itemValues, success, error) {
    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle(listName);
    var oListItem = oList.getItemById(id);
  
    if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
      for (var i = 0; i < fieldNames.length; i++) {
        oListItem.set_item(fieldNames[i], itemValues[i]);
      }
    } else {
      console.error("Invalid input: Field names and values must be arrays of the same length.");
      return;
    }
  
    oListItem.update();
  
    clientContext.executeQueryAsync(
      function () {
        if (success && typeof success === 'function') {
          success();
        } else {
          updateListItemCS_onQuerySucceeded();
        }
      },
      function (sender, args) {
        if (error && typeof error === 'function') {
          error(sender, args);
        } else {
          updateListItemCS_onQueryFailed(sender, args);
        }
      }
    );
  }
  
  function updateListItemCS_onQuerySucceeded() {
    console.log("Item updated");
  }
  
  function updateListItemCS_onQueryFailed(sender, args) {
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
    );
  }
  
  function updateListItem(site, listName, id, fieldNames, itemValues, success, error) {
    var clientContext = new SP.ClientContext(site);
    var oList = clientContext.get_web().get_lists().getByTitle(listName);
    var oListItem = oList.getItemById(id);
  
    if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
      for (var i = 0; i < fieldNames.length; i++) {
        oListItem.set_item(fieldNames[i], itemValues[i]);
      }
    } else {
      console.error("Invalid input: Field names and values must be arrays of the same length.");
      return;
    }
  
    oListItem.update();
  
    clientContext.executeQueryAsync(
      function () {
        if (success && typeof success === 'function') {
          success();
        } else {
          console.log('Item updated successfully.');
        }
      },
      function (sender, args) {
        var errorMessage = args.get_message();
        console.error('Request failed: ' + errorMessage);
        if (error && typeof error === 'function') {
          error(errorMessage);
        }
      }
    );
  }
  
  function asyncUpdateListItem(site, listName, id, fieldNames, itemValues) {
    return new Promise((resolve, reject) => {
      var clientContext = new SP.ClientContext(site);
      var oList = clientContext.get_web().get_lists().getByTitle(listName);
      var oListItem = oList.getItemById(id);
  
      if (Array.isArray(fieldNames) && Array.isArray(itemValues) && fieldNames.length === itemValues.length) {
        for (var i = 0; i < fieldNames.length; i++) {
          oListItem.set_item(fieldNames[i], itemValues[i]);
        }
      } else {
        var errorMessage = "Invalid input: Field names and values must be arrays of the same length.";
        console.error(errorMessage);
        reject(errorMessage);
        return;
      }
  
      oListItem.update();
  
      clientContext.executeQueryAsync(
        function () {
          resolve();
        },
        function (sender, args) {
          var errorMessage = args.get_message();
          console.error('Request failed: ' + errorMessage);
          reject(errorMessage);
        }
      );
    });
  }
  

  
  
  
  
  function retrieveFieldsOfListView(listTitle, viewName, callback) {
    var context = new SP.ClientContext.get_current();
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listTitle);
    var view = list.get_views().getByTitle(viewName);
    var listFields = view.get_viewFields();
    context.load(listFields);
    context.executeQueryAsync(function () {
      var fields = [];
      var e = listFields.getEnumerator();
      var fieldTypesToLoad = [];
      
      while (e.moveNext()) {
        var fieldName = e.get_current();
        var field = list.get_fields().getByInternalNameOrTitle(fieldName);
        context.load(field, 'FieldTypeKind');
        fieldTypesToLoad.push(field);
        fields.push({ Title: fieldName, Type: null }); 
      }
      
      context.executeQueryAsync(function() {
        fieldTypesToLoad.forEach(function (field, index) {
          var fieldType = field.get_fieldTypeKind();
          fields[index].Type = getFieldTypeString(fieldType);
        });
  
        if (typeof callback === 'function') {
          callback(fields);
        }
      }, function(sender, args) {
        console.log(args.get_message());
      });
    }, function(sender, args) {
      console.log(args.get_message());
    });
  }
  
  function getFieldTypeString(fieldType) {
    switch (fieldType) {
      case SP.FieldType.invalid:
        return 'Invalid';
      case SP.FieldType.integer:
        return 'Integer';
      case SP.FieldType.text:
        return 'Text';
      case SP.FieldType.dateTime:
        return 'DateTime';
      case SP.FieldType.counter:
        return 'Counter';
      case SP.FieldType.choice:
        return 'Choice';
      case SP.FieldType.lookup:
        return 'Lookup';
      case SP.FieldType.boolean:
        return 'Boolean';
      case SP.FieldType.number:
        return 'Number';
      case SP.FieldType.currency:
        return 'Currency';
      case SP.FieldType.url:
        return 'URL';
      case SP.FieldType.user:
        return 'User';
      case SP.FieldType.gridChoice:
        return 'GridChoice';
      case SP.FieldType.calculated:
        return 'Calculated';
      case SP.FieldType.file:
        return 'File';
      case SP.FieldType.attachments:
        return 'Attachments';
      case SP.FieldType.modStat:
        return 'ModStat';
      case SP.FieldType.recurrence:
        return 'Recurrence';
      case SP.FieldType.crossProjectLink:
        return 'CrossProjectLink';
      case SP.FieldType.outcomeChoice:
        return 'OutcomeChoice';
      case SP.FieldType.location:
        return 'Location';
      case SP.FieldType.geolocation:
        return 'Geolocation';
      default:
        return 'Unknown';
    }
  }
  
  
  
  
  function createListTemplateFromList(url,listTitle, templateName) {
    var context = new SP.ClientContext(url);
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listTitle);
  
    context.load(list);
    context.executeQueryAsync(function () {
        var listData = list.saveAsTemplate(templateName, templateName, templateName, false);
        context.executeQueryAsync(function () {
            console.log("List template created successfully.");
        }, function (sender, args) {
            console.log("Failed to create list template: " + args.get_message());
        });
    }, function (sender, args) {
        console.log("Error fetching list: " + args.get_message());
    });
  }
  
  
  
  
  function retrieveAllUsersInGroup(groupName, outputArray) {
    var clientContext = new SP.ClientContext.get_current();
    var groupCollection = clientContext.get_web().get_siteGroups();
    var visitorsGroup = groupCollection.getByName(groupName);
    var collUser = visitorsGroup.get_users();
    clientContext.load(collUser);
  
    clientContext.executeQueryAsync(
      Function.createDelegate(this, function () {
        retrieveAllUsersInGroup_onQuerySucceeded(collUser, outputArray);
      }),
      Function.createDelegate(this, onQueryFailed)
    );
  }
  
  function retrieveAllUsersInGroup_onQuerySucceeded(collUser, outputArray) {
    var userInfoArray = [];
  
    var userEnumerator = collUser.getEnumerator();
    while (userEnumerator.moveNext()) {
      var oUser = userEnumerator.get_current();
      var userInfo = {
        fullName: oUser.get_title(),
        id: oUser.get_id(),
        email: oUser.get_email(),
        loginName: oUser.get_loginName()
      };
      userInfoArray.push(userInfo);
    }
  
    if (outputArray) {
      outputArray.push.apply(outputArray, userInfoArray);
    }
  
  
  }
  
  function getCurrentUserGroups(siteURL, userLoginName, successCallback, errorCallback) {
    var clientContext = new SP.ClientContext(siteURL);

    var oUser = clientContext.get_web().ensureUser(userLoginName);
    var oGroups = oUser.get_groups();
  
    clientContext.load(oUser);
    clientContext.load(oGroups);
  
    clientContext.executeQueryAsync(
        function () {
            var groups = [];
            var groupsEnumerator = oGroups.getEnumerator();
  
            while (groupsEnumerator.moveNext()) {
                var oGroup = groupsEnumerator.get_current();
                var groupInfo = {
                    ID: oGroup.get_id(),
                    Name: oGroup.get_title()
                };
                groups.push(groupInfo);
            }
  
      
  
            if (typeof successCallback === 'function') {
                successCallback(groups);
            }
        },
        function (sender, args) {
            console.log("Failed to load user groups. Error: " + args.get_message());
  
            if (typeof errorCallback === 'function') {
                errorCallback(args.get_message());
            }
        }
    );
  }
  
  
  
  
  function retrieveGroupInfo(groupIdentifier, outputObject) {
    var clientContext = new SP.ClientContext.get_current();
    var groupCollection = clientContext.get_web().get_siteGroups();
    var visitorsGroup;
  
    if (typeof groupIdentifier === 'string') {
      visitorsGroup = groupCollection.getByName(groupIdentifier);
    } else if (typeof groupIdentifier === 'number') {
      visitorsGroup = groupCollection.getById(groupIdentifier);
    } else {
      throw new Error('Invalid group identifier. Please provide a valid string or number.');
    }
  
    clientContext.load(visitorsGroup, 'Title', 'Id', 'Description', 'Owner', 'Users', 'AllowMembersEditMembership', 'AllowRequestToJoinLeave', 'OnlyAllowMembersViewMembership');
  
    clientContext.executeQueryAsync(
      Function.createDelegate(this, function () {
        retrieveGroupInfo_onQuerySucceeded(visitorsGroup, outputObject);
      }),
      Function.createDelegate(this, onQueryFailed)
    );
  }
  
  function retrieveGroupInfo_onQuerySucceeded(visitorsGroup, outputObject) {
    outputObject.title = visitorsGroup.get_title();
    outputObject.id = visitorsGroup.get_id();
    outputObject.description = visitorsGroup.get_description();
    outputObject.owner = visitorsGroup.get_owner().get_loginName();
    outputObject.memberCount = visitorsGroup.get_users().get_count();
    outputObject.allowMembersEditMembership = visitorsGroup.get_allowMembersEditMembership();
    outputObject.allowRequestToJoinLeave = visitorsGroup.get_allowRequestToJoinLeave();
    outputObject.onlyAllowMembersViewMembership = visitorsGroup.get_onlyAllowMembersViewMembership();

  }
  
  function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
  }
  
  
  
  function addUserToGroup(siteURL,user, group, callback) {
    var clientContext = new SP.ClientContext(siteURL);
    var collGroup = clientContext.get_web().get_siteGroups();
  

    var oGroup;
    if (typeof group === 'string') {
        oGroup = collGroup.getByName(group);
    } else if (typeof group === 'number') {
        oGroup = collGroup.getById(group);
    } else {
        throw new Error('Invalid group identifier. Please provide a valid string or number.');
    }
  
    var userCreationInfo = new SP.UserCreationInformation();
  
   
    if (typeof user === 'string') {
      
        getUserByFullName(function (result) {
            if (result && result.LoginName) {
                userCreationInfo.set_loginName(result.LoginName);
                userCreationInfo.set_email(result.Email);
                userCreationInfo.set_title(result.FullName);
                addUserToGroupInternal(userCreationInfo, oGroup, clientContext, callback);
            } else {
                console.log('User not found or missing required properties.');
            }
        }, user);
    } else if (typeof user === 'object' && user.SPS_UserPrincipalName) {

        userCreationInfo.set_loginName(user.AccountName);
        userCreationInfo.set_email(user.SPS_UserPrincipalName);
        userCreationInfo.set_title(user.PrefferedName);
        addUserToGroupInternal(userCreationInfo, oGroup, callback);
    } else {
        console.log('Invalid user parameter. Please provide a valid user object or user name.');
    }
  }
  
  
  
  
  function addUserToGroupInternal(userCreationInfo, group, clientContext, callback) {
    var oUser = group.get_users().add(userCreationInfo);
  

    clientContext.load(oUser);
    clientContext.executeQueryAsync(
      Function.createDelegate(this, function () {
        if (callback && typeof callback === 'function') {
          callback(oUser);
        } else {
          addUserToGroup_onQuerySucceeded.call(this);
        }
      }),
      Function.createDelegate(this, this.onQueryFailed)
    );
  }
  
  
  function addUserToGroup_onQuerySucceeded() {
    alert("success - group add")
  }
  
  
  
  
  function removeUserFromGroup(site,groupName, userName, callbackFunction) {  
      var clientContext = new SP.ClientContext(site);  
      var siteGroups = clientContext.get_web().get_siteGroups();  
      var web = clientContext.get_web();  
      var spGroup = siteGroups.getByName(groupName);  
      var user = web.ensureUser(userName);  
      var userCollection = spGroup.get_users();  
      clientContext.load(user);  
      clientContext.load(spGroup);  
      clientContext.executeQueryAsync(function() {  
              userCollection.removeByLoginName(user.get_loginName());  
              clientContext.executeQueryAsync(function() {
                  callbackFunction();
              }, function(){}); 
          }  
          ,
           function() {  
              alert('Request failed.');  
          } 
      );   
  } 
  

  
  function createFolder(url, libraryName, folderName, callback) {
    var clientContext;
    var oWebsite;
    var oList;
    var itemCreateInfo;
  
    let baseURL = window.location.protocol + "//" + window.location.hostname;
  
    clientContext = new SP.ClientContext(baseURL + url);
    oWebsite = clientContext.get_web();
    oList = oWebsite.get_lists().getByTitle(libraryName);
  
    itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName(folderName);
    this.oListItem = oList.addItem(itemCreateInfo);
    this.oListItem.update();
  
    clientContext.load(this.oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, successHandler),
        Function.createDelegate(this, errorHandler)
    );
  
    function successHandler() {
        if (callback && typeof callback === 'function') {
            callback(this.oListItem);
        } else {
            alert("success");
        }
    }
  
    function errorHandler() {
        if (callback && typeof callback === 'function') {
            callback(null, arguments[1].get_message());
        } else {
            alert("Request failed: " + arguments[1].get_message());
        }
    }
  }
  
  async function async_createFolder(url, libraryName, folderName) {
    return new Promise((resolve, reject) => {
        let clientContext;
        let oWebsite;
        let oList;
        let itemCreateInfo;
  
        let baseURL = window.location.protocol + "//" + window.location.hostname;
  
        clientContext = new SP.ClientContext(baseURL + url);
        oWebsite = clientContext.get_web();
        oList = oWebsite.get_lists().getByTitle(libraryName);
  
        itemCreateInfo = new SP.ListItemCreationInformation();
        itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
        itemCreateInfo.set_leafName(folderName);
        let oListItem = oList.addItem(itemCreateInfo);
        oListItem.update();
  
        clientContext.load(oListItem);
        clientContext.executeQueryAsync(
            function() {
                resolve(oListItem);
            },
            function(sender, args) {
                reject(new Error(args.get_message()));
            }
        );
    });
  }
  
  
  
  
  function uploadFileToFolder(siteUrl, libraryName, folderPath, file, callback) {
    var clientContext = new SP.ClientContext(siteUrl);
    var library = clientContext.get_web().get_lists().getByTitle(libraryName);
    var folder = library.get_rootFolder().get_folders().getByUrl(folderPath);
  
    var fileCreateInfo = new SP.FileCreationInformation();
    fileCreateInfo.set_url(file.name);
    fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
    fileCreateInfo.set_overwrite(true); 
  
    var reader = new FileReader();
    reader.onload = function (result) {
        var content = new SP.Base64EncodedByteArray();
        var byteArray = new Uint8Array(result.target.result);
        for (var i = 0; i < byteArray.byteLength; i++) {
            content.append(byteArray[i]);
        }
        fileCreateInfo.set_content(content);
  
        var newFile = folder.get_files().add(fileCreateInfo);
  
        clientContext.load(newFile); 
  
        clientContext.executeQueryAsync(
            function () {
                console.log('File uploaded successfully');
                if (callback && typeof callback === 'function') {
                    callback(newFile);
                }
            },
            function (sender, args) {
                console.log('Error uploading file: ' + args.get_message());
            }
        );
    };
  
    reader.onerror = function (error) {
        alert('Error reading file: ' + error.target.error);
    };
  
    reader.readAsArrayBuffer(file);
  }
  
  function searchUsers(inputElement, displayElement, selectedUserCallback) {
    var userFullName = inputElement.value;
    var siteURL = "sharepointSite.com";
  
    getUsersFromUserProfile(siteURL, userFullName, function (users) {
        displayUsers(users, displayElement, inputElement, selectedUserCallback);
    });
  }
  
  function getUsersFromUserProfile(siteURL, userFullName, callback) {
    var restUrl = siteURL + "/_api/search/query?querytext='PreferredName:" + userFullName + "*'&sourceid='yourID'";
  
    fetch(restUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose'
        }
    })
    .then(response => response.json())
    .then(data => {
        var users = [];
        var queryResults = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
  
        for (var i = 0; i < queryResults.length; i++) {
            var user = queryResults[i].Cells.results.find(cell => cell.Key === "PreferredName");
            if (user) {
                users.push(user.Value);
            }
        }
  
        callback(users);
    })
    .catch(error => {
        console.log("Error executing query: " + JSON.stringify(error));
    });
  }
  
  function displayUsers(users, displayElement, inputElement, selectedUserCallback) {
    var showUsersHere = document.getElementById(displayElement);
    showUsersHere.innerHTML = ""; 
  
  
  
    users.forEach(function (user) {
        var userDiv = document.createElement("div");
        userDiv.textContent = user;
        userDiv.classList.add("resultElement")
  
  
        userDiv.addEventListener("click", function () {
            selectUser(user, inputElement, showUsersHere, selectedUserCallback);
        });
  
        showUsersHere.appendChild(userDiv);
    });
  }
  
  function selectUser(selectedUser, inputElement, showUsersHere, selectedUserCallback) {
    inputElement.value = selectedUser;
  
    showUsersHere.innerHTML = "";
    showUsersHere.style.display = "block";
  
    if (typeof selectedUserCallback === 'function') {
      selectedUserCallback(selectedUser);
    }
  }
  
  
  function teamsCall(email) {
     
      var teamsDeepLink = `https://teams.microsoft.com/l/call/0/0?users=${email}`;
      
  
      window.open(teamsDeepLink);
  }
  
  function phoneCall(number) {
    var sipUri = `tel:${number}`; 
    window.open(sipUri);
  }
  
  function async_retrieveItemsFiltered(
    siteURL,
    listName,
    fieldNames,
    fieldToFilter,
    valueToFilter
  ) {
    return new Promise((resolve, reject) => {
      var context = new SP.ClientContext(siteURL);
      var web = context.get_web();
      var list = web.get_lists().getByTitle(listName);

      var camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml(
        `<View><Query><Where><Eq><FieldRef Name='${fieldToFilter}'/><Value Type='Text'>${valueToFilter}</Value></Eq></Where></Query></View>`
      );
  
      var collListItem = list.getItems(camlQuery);
  
      context.load(collListItem, "Include(" + fieldNames.join(",") + ")");
  
      context.executeQueryAsync(
        function () {
          var array = [];
          var listItemEnumerator = collListItem.getEnumerator();
  
          while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var obj = {};
  
            for (var i = 0; i < fieldNames.length; i++) {
              var fieldName = fieldNames[i];
              var fieldValue = oListItem.get_item(fieldName);
  

              if (fieldValue instanceof SP.FieldUserValue) {
               
                fieldValue = fieldValue.get_lookupValue();
              }
  
              obj[fieldName] = fieldValue;
            }
  
            array.push(obj);
          }
  
          resolve(array);
        },
        function (sender, args) {
          console.error(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
          reject(args.get_message());
        }
      );
    });
  }
  
  function async_retrieveItems(siteURL, listName, fieldNames) {
    return new Promise((resolve, reject) => {
      var context = new SP.ClientContext(siteURL);
      var web = context.get_web();
      var list = web.get_lists().getByTitle(listName);
      var query = SP.CamlQuery.createAllItemsQuery();
      var collListItem = list.getItems(query);
      context.load(collListItem);
  
      context.executeQueryAsync(
        function () {
          var array = [];
          var listItemEnumerator = collListItem.getEnumerator();
  
          while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var obj = {};
  
            for (var i = 0; i < fieldNames.length; i++) {
              obj[fieldNames[i]] = oListItem.get_item(fieldNames[i]);
            }
  
            array.push(obj);
          }
  
          resolve(array);
        },
        function (sender, args) {
          console.error(
            "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
          );
          reject(args.get_message());
        }
      );
    });
  }