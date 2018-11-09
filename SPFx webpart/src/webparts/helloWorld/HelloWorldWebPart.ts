import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./HelloWorldWebPart.module.scss";
import * as strings from "HelloWorldWebPartStrings";
import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  ODataVersion,
  ISPHttpClientConfiguration
} from "@microsoft/sp-http";
import { IODataUser, IODataWeb } from "@microsoft/sp-odata-types";

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<
  IHelloWorldWebPartProps
> {
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.helloWorld}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">Welcome to SharePoint!</span>
              <p class="${
                styles.subTitle
              }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${styles.description}">${escape(
      this.properties.description
    )}</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    const spHttpClient: SPHttpClient = this.context.spHttpClient;
    const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;

    //GET current web info
    spHttpClient
      .get(`${currentWebUrl}/_api/web`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((web: IODataWeb) => {
          console.log("*******************This is web url");
          console.log(web.Url);
        });
      });

    //GET current user information from the User Information List
    spHttpClient
      .get(
        `${currentWebUrl}/_api/web/currentuser`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((user: IODataUser) => {
          console.log("*******************This is login name*******************");
          console.log(user.LoginName);
          console.log("*******************This is email*******************");
          console.log(user.Email);
        });
      });

    //GET current user information from the User Profile Service
    spHttpClient
      .get(
        `${currentWebUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((userProfileProps: any) => {
          console.log("*******************This is user profile*******************");
          console.log(userProfileProps);
          console.log("*******************This is user display name*******************");
          console.log(userProfileProps.DisplayName);
        });
      });
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
