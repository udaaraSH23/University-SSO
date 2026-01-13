#!/bin/bash

echo "Checking Kubernetes Secrets..."

echo ""
echo "--- Application Secrets (Namespace: default) ---"
if kubectl get secret app-secrets -n default > /dev/null 2>&1; then
    echo "✅ 'app-secrets' found."
    echo "   Keys: $(kubectl get secret app-secrets -n default -o jsonpath='{.data}' | jq -r 'keys[]')"
else
    echo "❌ 'app-secrets' NOT found in default namespace."
fi

echo ""
echo "--- ArgoCD Secrets (Namespace: argocd) ---"
if kubectl get secret argocd-initial-admin-secret -n argocd > /dev/null 2>&1; then
    echo "✅ 'argocd-initial-admin-secret' found (Initial Password)."
else
    echo "⚠️  'argocd-initial-admin-secret' NOT found (Password might have been rotated)."
fi

if kubectl get secret argocd-secret -n argocd > /dev/null 2>&1; then
    echo "✅ 'argocd-secret' found (ArgoCD Configuration)."
else
    echo "❌ 'argocd-secret' NOT found."
fi

echo ""
echo "--- Monitoring Secrets (Namespace: monitoring) ---"
if kubectl get secret grafana-admin -n monitoring > /dev/null 2>&1; then
    echo "✅ 'grafana-admin' found."
else
    echo "❌ 'grafana-admin' NOT found."
fi
