import GWLogo from "./GWLogo";
import UserStoryBar from "./UserStoryBar";
import * as azdev from "azure-devops-node-api";

function connectAzureDevops() {
    let orgUrl = "https://dev.azure.com/yourorgname";
    let token = "AZURE_PERSONAL_ACCESS_TOKEN";
    let authHandler = azdev.getPersonalAccessTokenHandler(token); 
    let connection = new azdev.WebApi(orgUrl, authHandler);
    return connection;
}

function Main() {

    let connection = connectAzureDevops();

    var userStory = {
        name : "OOXML Lite Camera",
        tasks: [
            {
                name: "Make BDD's",
                estimate: 4,
                progress: 100
            },{
                name: "Integrate",
                estimate: 6,
                progress: 1
            },{
                name: "Test",
                estimate: 2,
                progress: 0
            },{
                name: "Review",
                estimate: 1,
                progress: 0
            },{
                name: "Extra Crap",
                estimate: 1,
                progress: 0
            }
        ]
    }

    return (
        <>
            <GWLogo />
            <UserStoryBar
                name={ userStory.name }
                tasks={ userStory.tasks } />
        </>
    );
}

export default Main;