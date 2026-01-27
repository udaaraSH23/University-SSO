# WSO2 Configuration for University-SSO

This guide documents how to configure WSO2 Identity Server (IS) for the University-SSO portals (login, student, library, admin). It covers root organization setup, applications, roles/groups, redirect URLs, API scopes, and how to wire client credentials into the repo.

## Prerequisites

- Access to WSO2 Identity Server (admin console).
- Admin permissions to create organizations, applications, users, groups, and roles.
- The portal URLs and callback routes listed below.

## 1) Create the Root Organization

1. Sign in to the WSO2 IS management console as a super-admin.
2. Create (or select) the **root organization** that will own the applications.
3. Ensure the organization admin user is assigned and can manage applications and users.

## 2) Create Groups and Roles

### Groups

Create **three groups** in the root organization:

- **Students**
- **Admins**
- **Librarians**

### Roles

Create the following roles in the root organization and map them to the groups as noted:

| Role Name       | Description / Notes | Group Mapping |
|-----------------|---------------------|---------------|
| `ROLE_STUDENT`  | Organization role   | Students      |
| `ROLE_LIBRARIAN`| Organization role   | Librarians    |
| `ROLE_ADMIN`    | Organization role   | Admins        |

> Use the organization role template so these roles are scoped to the root organization.

## 3) Create Applications (Traditional Web Apps)

Create **four applications** as **Traditional Web Applications** in WSO2 IS:

1. **Login Portal**
2. **Student Portal**
3. **Library Portal**
4. **Admin Portal**

For each application:

- **Grant types**: enable **Authorization Code** and **Client Credentials**.
- **Claims**: include **email**, **groups**, **profile**, and **roles**.
- **User groups**: ensure group selection is enabled so the group claims are returned.
- **Copy the Client ID and Client Secret** after creation; these are required for the app configs and deployment secrets.

## 4) Authorized Redirect URLs

Configure the following **Authorized Redirect URLs** on the relevant applications.

> If your WSO2 console requires both redirect and post-logout URLs, use the logout URLs under post-logout or allowed logout redirect settings.

### Admin Portal

- `http://localhost:3002/auth/logout-callback`
- `http://localhost:3002/api/auth/callback/wso2`
- `https://admin.local/auth/logout-callback`
- `https://admin.local/api/auth/callback/wso2`

### Library Portal

- `https://library.local/auth/logout-callback`

### Student Portal

- `https://student.local/auth/logout-callback`

## 5) API Authorization Scopes (Admin Portal Only)

For the **Admin Portal** application, enable API scopes required for management APIs. Add the following scopes/permissions:

- `internal_group_mgt_view`
- `internal_group_mgt_update`
- `internal_user_mgt_list`
- `internal_user_mgt_update`
- `internal_user_mgt_view`
- `internal_user_mgt_create`
- `internal_user_mgt_delete`
- `internal_offline_invite`

> The **Library Portal** and **Student Portal** do **not** need these API scopes.

## 6) User Creation and Group Assignment

When creating users in WSO2 IS:

1. Create the user in the root organization.
2. Assign the user to exactly one of the three groups:
   - **Students**
   - **Admins**
   - **Librarians**
3. Confirm the user gets the correct role claim (`ROLE_STUDENT`, `ROLE_ADMIN`, or `ROLE_LIBRARIAN`).

## 7) Wire Client Credentials into the Repo

## 7a) MySQL Configuration and IAM Node Placement

The IAM stack deploys **WSO2 IS and MySQL** together on the K3s cluster using the Ansible IAM stack playbook. This playbook wires a MySQL-backed WSO2 IS deployment and should run on the **IAM node** (separate from application nodes) as described in the infrastructure provisioning docs. See:

- `infrastructure/terraform/README.md` for the VM topology and IP outputs used to target nodes.
- `infrastructure/ansible/playbooks/install-iam-stack.yml` for the exact MySQL/WSO2 roles and database settings.

Key MySQL/WSO2 settings from the IAM stack playbook:

- MySQL service host: `mysql-wso2.mysql.svc.cluster.local`
- Database name: `wso2is`
- Database user/password: `wso2is` / `wso2is-password`
- WSO2 image tag: `7.1.0`

> The IAM stack playbook (`install-iam-stack.yml`) installs the MySQL service, initializes the WSO2 schema, and deploys WSO2 IS. Run it against the IAM node after provisioning the cluster with Terraform and preparing the Ansible inventory.

### Ansible Secrets

This repository expects WSO2 secrets in `infrastructure/ansible/playbooks/secrets.yml` (note the `.yml` extension). Populate these values with the Client ID and Client Secret for each portal, along with the issuer/well-known URLs as needed.

Required keys include:

- `wso2_issuer`
- `wso2_well_known`
- `wso2_logout_url`
- `student_wso2_client_id`, `student_wso2_client_secret`
- `library_wso2_client_id`, `library_wso2_client_secret`
- `admin_wso2_client_id`, `admin_wso2_client_secret`

After updating secrets, run the playbook to deploy them:

```bash
cd infrastructure/ansible
ansible-playbook playbooks/deploy-secrets.yml
```

### Application Configuration

The shared auth package reads the WSO2 OIDC configuration from environment variables:

- `WSO2_CLIENT_ID`
- `WSO2_CLIENT_SECRET`
- `WSO2_ISSUER`
- `WSO2_WELL_KNOWN`

Ensure each portal has the correct client credentials (student, library, admin) and issuer settings in its runtime environment.

## 8) Validation Checklist

- ✅ Login works for each portal and returns the correct group and role claims.
- ✅ Redirect URLs match the portal callback routes.
- ✅ Admin portal API calls succeed using the required internal scopes.
- ✅ Users appear in WSO2 with the correct group membership and role assignment.

## 9) Troubleshooting

- **Invalid redirect URI**: verify the exact callback/logout URLs and protocol.
- **Missing roles/groups**: confirm group mapping and claim inclusion in the app settings.
- **Admin APIs failing**: ensure the admin portal application has all required `internal_*` scopes.
