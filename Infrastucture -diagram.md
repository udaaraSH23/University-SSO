flowchart TB
  %% Subgraph for Infrastructure
  subgraph Azure["fab:fa-microsoft Azure (Terraform)"]
    tf["fa:fa-code-branch Terraform: VM + networking"]
  end

  %% Subgraph for the Cluster
  subgraph Cluster["fa:fa-cubes K3s Cluster"]
    
    %% Nodes
    subgraph Nodes["fa:fa-server Nodes"]
      master["fa:fa-crown Control Plane Node"]
      worker["fa:fa-microchip Worker Node(s)"]
    end

    ingress["fa:fa-network-wired Traefik Ingress"]
    argocd["fab:fa-gitkraken ArgoCD (argocd namespace)"]
    coredns["fa:fa-sitemap CoreDNS ConfigMap"]
    secrets["fa:fa-key Portal Secrets (K8s)"]

    %% Application Namespaces
    subgraph Apps["fa:fa-th-large Portal Apps (default)"]
      
      %% Student Portal
      subgraph Student["fa:fa-user-graduate Student Portal"]
        student_ing["fa:fa-globe Ingress: student.local"]
        student_svc["fa:fa-door-open Service: student-portal"]
        student_dep["fa:fa-layer-group Deployment"]
        student_rs["fa:fa-copy ReplicaSet"]
        student_pod["fa:fa-cube Pod(s)"]
        student_secret["fa:fa-key Secret: student-portal"]
      end

      %% Library Portal
      subgraph Library["fa:fa-book Library Portal"]
        library_ing["fa:fa-globe Ingress: library.local"]
        library_svc["fa:fa-door-open Service: library-portal"]
        library_dep["fa:fa-layer-group Deployment"]
        library_rs["fa:fa-copy ReplicaSet"]
        library_pod["fa:fa-cube Pod(s)"]
        library_secret["fa:fa-key Secret: library-portal"]
      end

      %% Admin Portal
      subgraph Admin["fa:fa-user-shield Admin Portal"]
        admin_ing["fa:fa-globe Ingress: admin.local"]
        admin_svc["fa:fa-door-open Service: admin-portal"]
        admin_dep["fa:fa-layer-group Deployment"]
        admin_rs["fa:fa-copy ReplicaSet"]
        admin_pod["fa:fa-cube Pod(s)"]
        admin_secret["fa:fa-key Secret: admin-portal"]
      end

      postgres["fa:fa-database Postgres DB"]
      postgres_svc["fa:fa-door-open Service: postgres"]
    end

    %% IAM Namespace
    subgraph IAM["fa:fa-id-card IAM Stack (wso2is)"]
      wso2is["fa:fa-shield-alt WSO2 Identity Server"]
      mysql["fa:fa-database MySQL (WSO2 DB)"]
    end

    %% Monitoring Namespace
    subgraph Monitoring["fa:fa-heartbeat Monitoring"]
      prometheus["fa:fa-binoculars Prometheus"]
      alertmanager["fa:fa-bell Alertmanager"]
      grafana["fa:fa-chart-area Grafana"]
      grafana_cm["fa:fa-file-code ConfigMap: Dashboards"]
    end
    
  end

  %% Connections
  tf --> Cluster
  argocd --> student_dep
  argocd --> library_dep
  argocd --> admin_dep
  argocd --> postgres
  
  ingress --> student_ing
  ingress --> library_ing
  ingress --> admin_ing
  
  student_ing --> student_svc --> student_dep --> student_rs --> student_pod
  library_ing --> library_svc --> library_dep --> library_rs --> library_pod
  admin_ing --> admin_svc --> admin_dep --> admin_rs --> admin_pod
  
  student_pod --> postgres_svc --> postgres
  library_pod --> postgres_svc
  admin_pod --> postgres_svc
  
  student_pod -.-> wso2is
  library_pod -.-> wso2is
  admin_pod -.-> wso2is
  wso2is --> mysql
  
  prometheus --> student_pod
  prometheus --> library_pod
  prometheus --> admin_pod
  grafana --> prometheus
  alertmanager --> prometheus
  
  secrets --> student_secret --> student_pod
  secrets --> library_secret --> library_pod
  secrets --> admin_secret --> admin_pod
  
  grafana_cm --> grafana
  coredns --> wso2is

  %% Styling - UPDATED FOR HIGH CONTRAST
  %% Added 'color:#000' (black) to all classes so they show up on the light backgrounds
  classDef db fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000;
  classDef secret fill:#ffebee,stroke:#b71c1c,stroke-width:2px,stroke-dasharray: 5 5,color:#000;
  classDef monitor fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px,color:#000;
  classDef cloud fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000;

  class postgres,mysql db;
  class student_secret,library_secret,admin_secret,secrets secret;
  class prometheus,alertmanager,grafana monitor;
  class Azure cloud;