<asp:Content ContentPlaceHolderId="Your_ID" runat="server"> 


  <script src="https://servername/js/JS_Library/scripts/customLibrary.js"> //the one in the root folder</script> 

  
  <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
  <script type="text/javascript" src="/_layouts/15/SP.Runtime.js"></script>
  <script type="text/javascript" src="/_layouts/15/SP.js"></script>

 <script type="text/javascript">

    let notifyPopUp;
    let confirmWindow;
    let removeThis; //dont actually remove this please, that's the name of the function :)
    let sendNotification;
    let finishLoading;
    let confirm;
    let phoneDetails;
    let showModal;
    let errorModal;
    let isNintexModernForm;
    let sendReport;
    let finishReportLoading;

    let teamsLogo = "https://sharepointSiteURL/Icons/Microsoft_Office_Teams.png"
    let notificationLogo = "https://sharepointSiteURL/Icons/workflowStatusNotify.png"
    let callLogo = "https://sharepointSiteURL/Icons/call-icon.png"
    let contactIT = "https://sharepointSiteURL/Icons/contactIT.png"
    let errorIcon = "https://sharepointSiteURL/Icons/errorIcon.png"
    let successIcon = "https://sharepointSiteURL/Icons/successIcon.png"

    let loadingGIF = "https://sharepointSiteURL/Icons/workflowStatusLoading.gif"
    let workflowNotFoundIcon = "https://sharepointSiteURL/Icons/workflowNotFound.png"


    function gd(v){
        return document.getElementById(v)
    }
    document.addEventListener('DOMContentLoaded', function() {
    getUserProfileProperties(function(result) {
        let country = result.Country.toLowerCase(); // EN,DE,HU etc.
        let language;


    

        var script = document.createElement('script');
        script.src = `https://sharepointSiteURL/yourLocation/wfStatus_${country}.js`;
        
        console.log(`Loading script: ${script.src}`);

        script.onload = function() {
            if (typeof getLanguage === 'function') {
                language = getLanguage();
                console.log(`Language loaded: ${language}`);
                startSite(language);
            } else {
                console.error("getLanguage is not defined");
            }
        };

        script.onerror = function() {
            console.error("Error loading script:", script.src);

            var fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://sharepointSiteURL/yourLocation/wfStatus_de.js';
            
            fallbackScript.onload = function() {
                console.log('Fallback to English language file');

                if (typeof getLanguage === 'function') {
                    language = getLanguage();
                    startSite(language);
                } else {
                    console.error("getLanguage is not defined in the fallback script");
                }
            };

            fallbackScript.onerror = function() {
                console.error("Error loading fallback script:", fallbackScript.src);
            };

            document.body.appendChild(fallbackScript);
        };

        document.body.appendChild(script);
    }, _spPageContextInfo.userDisplayName);
});


    
const loading = (mainElement,loadingInner) =>{
        const main = gd(mainElement)

        main.innerHTML = loadingInner

    }



function startSite(lang) {
  
    const loadingInner = `

<div id="loading">
    <img src="${loadingGIF}">
    <span>${lang.loading}</span>
</div>
`

        loading("baseLoading",loadingInner)

        notifyPopUp = (id,currentuser,displayname,source) =>{


const content = `${lang.reminderConfirm}${displayname}`

id="phonePop"

const main = gd("modal")

main.innerHTML += confirmWindow(id,content,`sendNotification('${currentuser}','${displayname}','${source}')`)


}

isNintexModernForm = () =>{
    let url = ""

if(isNintex){
        url = `sharepointSiteURL${siteLocation}/_layouts/15/NintexForms/Modern/DisplayForm.aspx?List=${ListId}&ID=${itemID}&Source=${Source}`
        return url
    } 
    else{
        console.log("Source:",Source)
        url = Source.split('&ContentTypeId')
        console.log(url)
        return url
    }
}

    
  confirmWindow = (id,content,trueFunc) =>{
        const mainWindow = `
        <div class="overlay" id=${id}>
            <div class="confirmWindow">
                    <div class="confirmContent">
                        ${content}
                        </div>

                        <div class="confirmButtons">
                            <span onclick="confirm(true,${trueFunc});removeThis('${id}')">${lang.confirmButtonYes}</span>
                            <span onclick="removeThis('${id}')">${lang.confirmButtonNo}</span>

                            </div>

                </div>
            </div>

        `
        return mainWindow


    }

    removeThis = (id) =>{
            gd(id).remove()
    }

    sendReport = (title,errorMessage) =>{
        loading("modal-content",lang.loading)

        let listSite = "https://sharepointSiteURL/listLocation"
        let listName = "WorkflowHistory_Reports"


        let columns = ["Title","ErrorMessage","list","site","item"]

        let values = [title,errorMessage,ListId,siteLocation,itemID]

        createListItem(listSite,listName,columns,values,()=>{
            finishReportLoading("modal-content","teszt")
        })
    }

    errorModal = (text) =>{

        let sender = _spPageContextInfo.userDisplayName;
        const content = `
    <div class="errorModal">
        <div class="errorTop">
            <img src="${errorIcon}">
            <span class="errorModalLabel">
                ${text}
            </span>
        </div>
        <div class="errorControl">
            <span class="errorModalIMG">
                <img src="${contactIT}" alt="No Workflow Data">
            </span>
            <div class="confirmButtons">
                <span class="reportError">
                    ${lang.reportError}
                </span>
            </div>
        </div>
    </div>
`;


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('reportError')) {
        sendReport(`${sender} submitted an error`, `${text}`);
    }
});






        showModal(lang.errorHeader,content)
    }

    
    sendNotification = (title,contact,ItemLink) =>{
    
    loading("modal-content",lang.loading)

    let listSite = "https://sharepointSiteURL/listLocation"
    let listName = "WorkflowHistory_Notification"


    let columns = ["Title","Contact","ItemLink","itemID","listName"]

    let values = [title,SP.FieldUserValue.fromUser(contact),ItemLink,itemID,ListId]

    createListItem(listSite,listName,columns,values,()=>{
        console.log("done")
        finishLoading("modal-content",contact)
    })

}


    
finishLoading = (mainElement,contactFullName) =>{
            const main = gd(mainElement)
            const finishedInner = `
        <div id="finished">
            <img src="${successIcon}">
            <span>${lang.reminderSent}</span>
            <span id="okBtn" onclick="(() => gd('modal').style.display = 'none')()"
    style="background-color: #f39b00; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 20px;">
    OK
</span>

        </div>
    
    `


            main.innerHTML = finishedInner


    }

        
finishReportLoading = (mainElement) =>{
            const main = gd(mainElement)
            const finishedInner = `
        <div id="finished">
            <img src="${successIcon}">
            <span>${lang.reportSent}</span>
            <span id="okBtn" onclick="(() => gd('modal').style.display = 'none')()"
    style="background-color: #f39b00; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 20px;">
    OK
</span>

        </div>
    
    `


            main.innerHTML = finishedInner


    }



       
    confirm =(value,trueFunc) =>{

    if(value){
        return trueFunc
    }
    else{
        return;
    }

    }

    phoneDetails = (name,number) =>{
        const content = `${name}: ${number} - ${lang.confirmCall}`

        const main = gd("modal")

        number = new String(number).replaceAll(/[ ()\/-]/g, '');

        main.innerHTML += confirmWindow("phoneWindow",content,`phoneCall(${number})`)



    }

    showModal = (title, content) => {
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `<h3>${title}</h3><div>${content}</div>
                                <div style="text-align: center;">
                                    <span id="okBtn"  onclick="(() => gd('modal').style.display = 'none')()"
                                            style="background-color: #f39b00; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 20px;">
                                            ${lang.buttonBack}</span>
                                </div>`;
        document.getElementById('modal').style.display = 'block';

    }


   


      
    	
   
  const siteLocation = _spPageContextInfo.webServerRelativeUrl.toLowerCase() 




 
    	
  
    	//id
		const urlParams = new URLSearchParams(window.location.href);
		const itemID = urlParams.get('ID');

        const Source = urlParams.get('Source')

        const isNintex = urlParams.get("isNintex")

        const ListId = urlParams.get("List").replace(/{|}/g, "");

		
		//list title
		const listTitle = _spPageContextInfo.listTitle.toLowerCase()
			
		const currentUserFullName = _spPageContextInfo.userDisplayName
		
		const currentUserID = _spPageContextInfo.userId


    
        const requestData = {
            site: siteLocation,
            itemId: itemID, 
            listName: listTitle,
            userID: currentUserID,
            userFullName: currentUserFullName,
            listID: ListId
            
   
        };
        
        console.log("data:",requestData)
        







    fetch('https://serverName/getWorkflowHistory', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
})
.then(response => {
    if (!response.ok) { 
        return response.json().then(errorData => {
     
            errorModal(errorData.error)

            throw new Error(errorData.error);

        });
    }
    return response.json();
})
.then(data => {
    console.log("fullData:", data);


    if(data.workflowData.length === 0){

        const content = `
            <div class="errorModal">
                <span class="errorModalIMG">
                    <img src="${workflowNotFoundIcon}" alt="No Workflow Data">
                    </span>
                <span class = "errorModalLabel">
                    ${lang.noWorkflows}
                    </span>
                </div>
        `

        showModal(lang.workflowStatus,content)
        finishBaseLoading()
    }


    const displayCallButton = (country,number,name) =>{

        if(country === "no-Country"){ 
            //this was hu-HU before. Since not everyone has Caesar, I've made this quickfix so it's the same for everyone. btw just remove the branch and it should work
            return `<img src="${callLogo}" alt="" onclick="phoneCall('${number}')">`
        }
        else{
            return `<img src="${callLogo}" alt="" onclick="phoneDetails('${name}','${number}')">`
        }
    }

  
    let content = "";
    let promises = []; 


    data.workflowData.forEach(({ displayName, outcome, idle, startDate }, index) => {


    let cardContent = "";
    if (Array.isArray(displayName)) {

        cardContent += `<div class="card">
                            <div class="header">${lang.groupTask}</div>
                            <div class="group-members">`;
  displayName.forEach(member => {
    promises.push(new Promise((resolve, reject) => {
        getUserProfileProperties(function(result) {
            const userProperties = result;

            let userEmail = userProperties.WorkEmail;

            let pictureURL = userProperties && userProperties.PictureURL
                ? userProperties.PictureURL
                : "https://sharePointSiteName/User%20Photos/Profilbilder/defaultUser.jpg";
            let phoneNumber = userProperties ? userProperties.WorkPhone : "";
            
     
            resolve({ pictureURL, member, phoneNumber, userEmail });
        }, member.Title);
    }));
});

Promise.all(promises)
    .then(results => {
     
        results.forEach(({ pictureURL, member, phoneNumber, userEmail }) => {
      
            cardContent += `<div class="group-member">
                                <div class="profilePic" onclick="showHiddenButtons('${member.Title}_buttons')">
                                    <img src="${pictureURL}" alt="Profile Picture">
                                </div>
                                <div class="name">${member.Title}</div>
                            </div>

                            <div class="hiddenButtonsContainer" style="display:none" id="${member.Title}_buttons">
                                <div class="hiddenButtons">
                                    <div class="hiddenInfo">
                                        <div class="profilePic">
                                            <img src="${pictureURL}"  alt="Profile Picture">
                                        </div>
                                        <div class="name">${member.Title}</div>
                                    </div>
                                    <div class="buttons">
                                        <div class="callButton">
                                            ${displayCallButton(_spPageContextInfo.currentCultureName,phoneNumber,member.Title)}
                                        </div>
                                        <div class="teamsCall">
                                            <img src="${teamsLogo}" onclick="teamsCall('${userEmail}')">
                                        </div>
                                        <div class="notifyButton">
                                            <img src="${notificationLogo}" alt="" onclick="notifyPopUp('ID_${phoneNumber}','${currentUserFullName}','${member.Title}','${isNintexModernForm()}}/DispForm.aspx?ID=${itemID}')">
                                        </div>
                                    </div>
                                    <span class='innerButton' onclick="hideInfo('${member.Title}_buttons')">${lang.buttonBack}</span>
                                </div>
                            </div>`;
                                    ;
                });

                cardContent += `</div>
                                <div class="taskInfo">
                                    <div class="idle">${lang.idle} ${idle} ${lang.days}</div>
                                    <div class="startDate">${lang.startDate}${startDate}</div>
                                </div>
                            </div>`;

              
                content += cardContent;
                
                finishBaseLoading()
                showModal(lang.workflowStatus, content);
            })
            .catch(error => {
                console.error('Error fetching profile picture URLs:', error);
                errorModal(errorData.error)
            });
        } else {

            
            getUserProfileProperties(function(result) {
                userProperties =  result
                console.log(userProperties)

                      // User card
            let pictureURL = "";
            
            if (userProperties.PictureURL) {
                pictureURL = userProperties.PictureURL;
                console.log("URL:",pictureURL)
            } else {
                pictureURL = "https://sharePointSiteName/User%20Photos/Profilbilder/defaultUser.jpg";
            }

            cardContent += `<div class="card">
                    <div class="header">${lang.taskStatus}</div>
                    <div class="inner">
                        <div class="userInfo">
                            <div class="profilePic">
                                <img src="${pictureURL}" alt="Profile Picture">
                            </div>
                            <div class="name">${displayName}</div>
                        </div>
                        <div class="taskInfo">
                            <div class="idle">${lang.idle} ${idle} ${lang.days}</div>
                            <div class="startDate">${lang.startDate}${startDate}</div>
                        </div>
                    </div>
                    <div class="buttons">
                        <div class="callButton">
                            ${displayCallButton(_spPageContextInfo.currentCultureName, userProperties.WorkPhone, displayName)}
                        </div>
                        <div class="teamsCall">
                            <img src="${teamsLogo}" onclick="teamsCall('${userProperties.WorkEmail}')">
                        </div>
                        <div class="notifyButton"> 
    <img src="${notificationLogo}" alt="" onclick="notifyPopUp('ID_${userProperties.WorkPhone}','${currentUserFullName}','${displayName}','${isNintexModernForm()}')">
</div>


                    </div>
                </div>`;


  
            content += cardContent;

            finishBaseLoading()
            showModal(lang.workflowStatus, content);
            

            }, displayName);

          
      
        }
    });
})
.catch(error => {
    finishBaseLoading()
    console.error('Error fetching workflow history:', error);
    errorModal(errorData.error)
});







function finishBaseLoading(){
    gd("baseLoading").style.display = "none"
}

    const modalElement = gd('modal');
    

    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const displayValue = modalElement.style.display;
                if(displayValue === "none"){
                    history.back()
                }
            }
        }
    });

    observer.observe(modalElement, { attributes: true });

    }


    

    function showHiddenButtons(element){
    gd(element).style.display = "inline"
 
}

function hideInfo(element){
    gd(element).style.display = "none"
  
}
    </script> 

    <style>
        /* Modal (background) */
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
            
        }

        /* Modal Content */
        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 700px;
            overflow-y: auto;
            max-height: 700px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            border-radius: 10px; 
            text-align: center; 
        }

        .close-button {
            color: white;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close-button:hover,
        .close-button:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }


        /*------------USER CARD------------*/
 
        .card {
            background-color: #ffffff;
            width: 450px;
            display: flex;
            flex-direction: column;
            margin: 20px auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #face4b;
            padding: 10px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            text-align: center;
            font-weight: bold;
            color: #ffffff;
        }

        .userInfo {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 20px 20px 0;
            width: 100%;
            text-align: center;
        }

        .profilePic {
            cursor: pointer;
            width: 80px; 
            height: 80px; 
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 0 0 2px #ffffff; 
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .profilePic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            transition: transform 0.3s ease;
        }

        .buttons img:hover {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }

        .profilePic:hover img {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }
        .name {
            font-size: 16px; 
            font-weight: bold;
            margin-top: 10px;
            color: #333333; 
        }

        .taskInfo {
            text-align: center;
            color: #555555; 
            padding-bottom: 16px;
        }

        .buttons {
            display: flex;
            justify-content: space-evenly;
            background-color: #f0f0f0;
            align-items: center;
            padding: 10px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            
        }

        .buttons img {
            width: 40px;
            height: 40px;
            cursor: pointer;
        }

        .inner {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .group-members {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            border-bottom: 2px solid grey;
            margin-bottom:10px;
            
        }

        .group-member {
            text-align: center;
            width: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            
        }

        .group-member .profilePic {
            width: 80px;
            height: 80px;
            margin-bottom: 5px;
        }

        .group-member .name {
            font-size: 16px;
            margin-bottom: 5px;
        }

      /*--------USER CARD ENDS---------*/


        #loading, #finished {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: large;
            gap: 20px;
        }

        #loading img{
            width: 800px;
            height: 600px;
        }

        #finished img {
            width: 100px;
            height: 100px;
        }

        #baseLoading{
            position: fixed;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
            background-color: #f1f2f1;
           

        }

        .hiddenButtonsContainer {
            display: none;
            position: fixed;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .hiddenButtonsContainer.show {
            display: block;
            opacity: 1;
            visibility: visible;
        }

        .hiddenButtons{
            background-color:#fefefe ;
            width: 20%;
            height: fit-content;
            padding-top: -10px;
            padding-bottom: 10px;
            margin:0 auto;
            border-radius: 10px;
        }

        .hiddenInfo{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 10px;
        }
   
        .innerButton{
            background-color: #f39b00;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin-top: 15px;
            cursor: pointer;
            border-radius: 20px;

        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); 
            backdrop-filter: blur(5px);
            z-index: 9998; 
        }

        .confirmWindow {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #ffffff;
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                padding: 20px;
                z-index: 9999; 
                border-radius: 10px;
            }

            .confirmContent {
                margin-bottom: 15px;
                font-size: larger;
            }

            .confirmButtons {
                display: flex;
                justify-content: center;
            }

            .confirmButtons span {
                cursor: pointer;
                margin-right: 10px;
                padding: 10px 20px;
                border-radius: 20px;
                background-color: #f39b00;
                color: #ffffff;
                text-decoration: none;
                transition: background-color 0.3s;
            }

            .confirmButtons span:hover {
                background-color: #e68a00;
            }

            .errorModal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: large;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    margin: 20px auto;

}

.errorModal img {
    height: 150px;
    width: 150px;
    margin-bottom: 20px;
}

.errorControl {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 10px;

}

.errorControl img {
    width: 100px;
    height: 100px;
}

.errorModalLabel {
    font-size: medium;
    color: red;
    margin-bottom: 20px;
}

.button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #0056b3;
}

.button:focus {
    outline: none;
}

.errorTop{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.errorTop img{
    width: 44px;
    height: 44px;
}




    </style>

    <div id="baseLoading">

    </div>

    <div id="modal" class="modal">
        <div id="modal-content" class="modal-content">
        </div>
    </div>
</asp:Content>