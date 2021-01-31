import GWLogo from "./GWLogo";
import UserStoryBar from "./UserStoryBar";
import * as azdev from "azure-devops-node-api";
import React, { useState, useEffect } from "react";

function connectAzureDevops() {
    let orgUrl = "https://dev.azure.com/yourorgname";
    let token = "AZURE_PERSONAL_ACCESS_TOKEN";
    let authHandler = azdev.getPersonalAccessTokenHandler(token); 
    let connection = new azdev.WebApi(orgUrl, authHandler);
    return connection;
}

function getChildrenWorkItems(workItem){
    let childWorkItems = []
    workItem.relations.forEach(element => {
        if (element.attributes.name === "Child"){
            let split_url = element.url.split("/");
            let childWorkItemNumber = Number(split_url[split_url.length - 1]);
            childWorkItems.push(childWorkItemNumber);
        }
    });
    return childWorkItems;
}

function getTask(workItemNumber, connection){
    let name = null;
    let estimate = null;

    connection.getWorkItemTrackingApi().then((workItemTrackingApi) => {
        workItemTrackingApi.getWorkItem(workItemNumber).then( (workItem) => {
            name = workItem.fields["System.Title"];
            estimate = workItem.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
        });
    });
    return { name: name, estimate: estimate }
}

function Main() {

    let initTasks = [
        {
            name: "Rendering...",
            estimate: 1,
            progress: 100
        }
    ]

    let workItemNumber = 114352;

    const [userStoryName, setUserStoryName] = React.useState("")
    const [relationships, setRelationships] = React.useState(null);
    const [tasks, setTasks]                 = React.useState(initTasks);

    let connection = connectAzureDevops();

    //Get User Story Name And Relationships
    connection.getWorkItemTrackingApi().then((workItemTrackingApi) => {
        workItemTrackingApi.getWorkItem(workItemNumber, undefined, undefined, "Relations").then( (workItem) => {
            console.log(workItem);
            setUserStoryName(workItem.fields["System.Title"]);
            let childWorkItems = getChildrenWorkItems(workItem)
            setRelationships(childWorkItems);
        });
    });

    //Get Tasks
    let list = [];
    if (relationships != null){
        relationships.forEach(element => {
            let task = getTask(element, connection);
            console.log(task);
            list.push(task);
        });
    }
    setTasks(list);

    return (
        <>
            <GWLogo />
            <UserStoryBar
                name={ userStoryName }
                tasks={ tasks } />
            
        </>
    );
}

export default Main;