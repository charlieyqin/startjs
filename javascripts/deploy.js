var jsonProcessed = false;

function processStartJson(json) {
    alert(json);
    return json;
};

function deploy() {
    var startJsonUrl = document.referrer + "/start.json";
    var jsonProcessed = false;
    fetch(startJsonUrl)
        .then(function (response) {
            var startJson = processStartJson(response.json());
            jsonProcessed = true;
            return;
        });

    while (!jsonProcessed) { }

    return;

    var url = document.forms["deployer"]["url"].value;
    var jobPosting = url + 'marathon/v2/apps';

    fetch(jobPosting, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Hubot',
            login: 'hubot',
        })
    });
};

var deployTemplate = {
    "id": "/product/service/myApp",
    "cmd": "npm start",
    "cpus": 1.5,
    "mem": 256.0,
    "portDefinitions": [
        { "port": 8080, "protocol": "tcp", "name": "http", labels: { "VIP_0": "10.0.0.1:80" } },
        { "port": 9000, "protocol": "tcp", "name": "admin" }
    ],
    "requirePorts": false,
    "instances": 3,
    "executor": "",
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "group/image",
            "network": "BRIDGE",
            "portMappings": [
                {
                    "containerPort": 8080,
                    "hostPort": 0,
                    "servicePort": 9000,
                    "protocol": "tcp"
                },
                {
                    "containerPort": 161,
                    "hostPort": 0,
                    "protocol": "udp"
                }
            ],
            "privileged": false,
            "parameters": [
                { "key": "a-docker-option", "value": "xxx" },
                { "key": "b-docker-option", "value": "yyy" }
            ]
        },
        "volumes": [
            {
                "containerPath": "/etc/a",
                "hostPath": "/var/data/a",
                "mode": "RO"
            },
            {
                "containerPath": "/etc/b",
                "hostPath": "/var/data/b",
                "mode": "RW"
            }
        ]
    },
    "env": {
        "LD_LIBRARY_PATH": "/usr/local/lib/myLib"
    },
    "constraints": [
        ["attribute", "OPERATOR", "value"]
    ],
    "acceptedResourceRoles": [ /* since 0.9.0 */
        "role1", "*"
    ],
    "labels": {
        "environment": "staging"
    },
    "fetch": [
        { "uri": "https://raw.github.com/mesosphere/marathon/master/README.md" },
        { "uri": "https://foo.com/archive.zip", "executable": false, "extract": true, "cache": true }
    ],
    "dependencies": ["/product/db/mongo", "/product/db", "../../db"],
    "healthChecks": [
        {
            "protocol": "HTTP",
            "path": "/health",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 10,
            "portIndex": 0,
            "timeoutSeconds": 10,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "HTTPS",
            "path": "/machinehealth",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 10,
            "port": 3333,
            "timeoutSeconds": 10,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "TCP",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 5,
            "portIndex": 1,
            "timeoutSeconds": 5,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "COMMAND",
            "command": { "value": "curl -f -X GET http://$HOST:$PORT0/health" },
            "maxConsecutiveFailures": 3
        }
    ],
    "backoffSeconds": 1,
    "backoffFactor": 1.15,
    "maxLaunchDelaySeconds": 3600,
    "upgradeStrategy": {
        "minimumHealthCapacity": 0.5,
        "maximumOverCapacity": 0.2
    }
};
