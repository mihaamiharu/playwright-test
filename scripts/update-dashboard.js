const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getWorkflowData(workflowId) {
    try {
        const { data: runs } = await octokit.rest.actions.listWorkflowRuns({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            workflow_id: workflowId,
            per_page: 1,
        });

        if (runs.workflow_runs.length === 0) return null;

        const latestRun = runs.workflow_runs[0];
        const runStatus = latestRun.status;
        const runConclusion = latestRun.conclusion;

        let status = "failure";
        if (runStatus === "in_progress" || runStatus === "queued") {
            status = "running";
        } else if (runConclusion === "success") {
            status = "success";
        }

        let triggeredBy = latestRun.actor.login;
        if (latestRun.event === 'schedule') {
            triggeredBy = "Scheduled Run";
        }
        
        return {
            status: status,
            runDate: new Date(latestRun.created_at).toLocaleString(),
            triggeredBy: triggeredBy,
            runUrl: latestRun.html_url
        };

    } catch (error) {
        console.error(`Error fetching ${workflowId}:`, error);
        return { status: "failure", runDate: "N/A", triggeredBy: "Error", runUrl: "#" };
    }
}

async function buildDashboard() {
    const dailyData = await getWorkflowData("daily-regression.yml");
    const onDemandData = await getWorkflowData("on-demand-regression.yml");

    const dashboardData = {
        daily: dailyData,
        ondemand: onDemandData,
        last_updated: new Date().toISOString()
    };

    fs.writeFileSync("status.json", JSON.stringify(dashboardData, null, 2));
    console.log("Wrote status.json");
}

buildDashboard();