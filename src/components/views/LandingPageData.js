import ASSETIMG from "../../assets/UIUX/images/allAssets.png";
import USERSIMG from "../../assets/UIUX/images/allUsers.png";
import DOCIMG from "../../assets/UIUX/images/allDocuments.png";
import ENGIMG from "../../assets/UIUX/images/engineeringData.png";
import ROLEIMG from "../../assets/UIUX/images/roleAndPermissions.png";
import HIERARCHYIMG from "../../assets/UIUX/images/hierarchy.png";
import APPROVAL from "../../assets/UIUX/images/approval.png";
import WORKORDER from "../../assets/UIUX/images/workorder.png"
export const cardsData = [
    {
        id:1,
        image:USERSIMG,
        title:"All Users",
        description:"List of users who are working in current organization",
        buttonTitle:"Create New User",
        createPermisson:"user_Create",
        viewPermissoin:"users_Page_View",
        viewPath:"all-users",
        createPath:"create-user"
    },
    {
        id:2,
        image:ASSETIMG,
        title:"All Assets",
        description:"List of assets and its details available in the 3d system",
        buttonTitle:"Create New Asset",
        createPermisson:"asset_Create",
        viewPermissoin:"assets_Page_View",
        viewPath:"all-assets",
        createPath:"create-asset"
    },
    {
        id:3,
        image:DOCIMG,
        title:"All Documents",
        description:"Documents which are related to the assets",
        buttonTitle:"Create New Document",
        createPermisson:"document_Create",
        viewPermissoin:"documents_Page_View",
        viewPath:"documents",
        createPath:"create-document",
        roles : ["086","001","002"]
    },
    {
        id:4,
        image:ROLEIMG,
        title:"Roles & Permissions",
        description:"View all allocated roles and permissions for users",
        buttonTitle:"Add Roles & Permissions",
        createPermisson:"role_Assign",
        viewPermissoin:"roles_And_Permissions_Page_View",
        viewPath:"roles-and-permissions",
        createPath:"roles-and-permissions"
    },
    {
        id:5,
        image:WORKORDER,
        title:"Work Orders",
        description:"View all work orders for users",
        buttonTitle:"Create Work Order",
        createPermisson:"workOrder_Create",
        viewPermissoin:"workOrder_Page_View",
        viewPath:"work-order-list",
        createPath:"work-order"
    },
    {
        id:6,
        image:APPROVAL,
        title:"Notifications",
        description:"View all the Notifications",
        buttonTitle:"Create Notification",
        createPermisson:"user_Approval_Assign",
        viewPermissoin:"user_Approval_View_Details",
        viewPath:"notifications-list",
        createPath:"create-notification",
        roles : ["086","001","002"]
    },
]