import GWLogo from "./GWLogo";
import UserStoryBar from "./UserStoryBar";
import * as azdev from "azure-devops-node-api";
import React, { useState, useEffect } from "react";

function connectAzureDevops() {
    let orgUrl = "https://dev.azure.com/glasswall";
    let token = "v2nctwthn4qmhkapf55i6t3qs5kxk3tgd6p7mjlzshlbnymguslq";
    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    return connection;
}

function getChildrenWorkItems(workItem) {
    let childWorkItems = []
    workItem.relations.forEach(element => {
        if (element.attributes.name === "Child") {
            let split_url = element.url.split("/");
            let childWorkItemNumber = Number(split_url[split_url.length - 1]);
            childWorkItems.push(childWorkItemNumber);
        }
    });
    return childWorkItems;
}

async function getTask(workItemTrackingApi, workItemNumber, connection) {
    return workItemTrackingApi.getWorkItem(workItemNumber).then((workItem) => {
        const name = workItem.fields["System.Title"];
        const estimate = workItem.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
        return { name: name, estimate: estimate, progress: 100 }
    });
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
    const [tasks, setTasks] = React.useState(initTasks);

    useEffect(() => {

        const connnect = async () => {

            let connection = connectAzureDevops();

            //Get User Story Name And Relationships
            connection.getWorkItemTrackingApi().then((workItemTrackingApi) => {
                workItemTrackingApi.getWorkItem(workItemNumber, undefined, undefined, "Relations").then((workItem) => {
                    console.log(workItem);
                    setUserStoryName(workItem.fields["System.Title"]);
                    let childWorkItems = getChildrenWorkItems(workItem)
                    // setRelationships(childWorkItems);

                    //Get Tasks
                    let list = [];
                    if (childWorkItems != null) {
                        childWorkItems.forEach((element) => {
                            getTask(workItemTrackingApi, element, connection).then(t => {
                                console.log(t);
                                list.push(t);
                            });
                        });
                    }
                    setTasks(list);

                });
            });
        }

        connnect();

    }, []);

    return (
        <>
            <GWLogo />
            <UserStoryBar
                name={userStoryName}
                tasks={tasks} />

        </>
    );
}

export default Main;