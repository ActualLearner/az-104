#!/usr/bin/env python3
"""
Generator for exam_questions_exam3.js (Domain 4: Questions e3-q43 to e3-q56)
"""

def get_domain4_questions():
    return [
        {
            "id": "e3-q43",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "VNet Peering Non-Transitive Routing Mechanics and NVAs",
            "scenario": "Your enterprise has three Virtual Networks deployed in the same Azure region:\n- `Hub-VNet` (`10.100.0.0/16`) contains a centralized VPN Gateway connected to on-premises.\n- `Spoke-A` (`10.101.0.0/16`) is peered directly with `Hub-VNet`.\n- `Spoke-B` (`10.102.0.0/16`) is peered directly with `Hub-VNet`.\n`Spoke-A` is NOT peered directly with `Spoke-B`.\n\nA developer reports that a virtual machine in `Spoke-A` cannot communicate with a virtual machine in `Spoke-B`. Why does this communication fail?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Azure VNet Peering is strictly non-transitive; traffic from `Spoke-A` cannot traverse `Hub-VNet` to reach `Spoke-B` without a router/firewall (NVA) and User-Defined Routes (UDRs)."},
                {"id": "B", "text": "Gateway transit is disabled between Spoke-A and Spoke-B."},
                {"id": "C", "text": "VNet peering between VNets in the same region does not support RFC 1918 private address ranges."},
                {"id": "D", "text": "Virtual machines in peered VNets must share the same Application Security Group."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Explain why traffic does not transit between two spoke VNets peered only to a central hub VNet.",
                "flawedMentalModel": "Assuming VNet peering acts like a standard router where traffic automatically hops across intermediate peered networks.",
                "coreMechanic": "Azure Virtual Network Peering is strictly non-transitive. If VNet A is peered to VNet B, and VNet B is peered to VNet C, VNet A CANNOT communicate with VNet C through VNet B natively. To enable spoke-to-spoke communication through a hub, you must route traffic through a Network Virtual Appliance (NVA) or Azure Firewall in the hub using User-Defined Routes.",
                "distractors": {
                    "B": "Gateway transit allows spokes to reach the VPN/ExpressRoute gateway; it does not make VNet peering transitive.",
                    "C": "VNet peering is explicitly designed for RFC 1918 private address spaces.",
                    "D": "Application Security Groups cannot span across different VNets."
                },
                "heuristic": "Azure VNet Peering is NON-TRANSITIVE. Spoke-to-spoke routing through a hub requires an NVA + UDRs.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview"
            }
        },
        {
            "id": "e3-q44",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Gateway Transit and Use Remote Gateway Peering Configuration",
            "scenario": "You deploy a Hub-and-Spoke topology with `Hub-VNet` and `Spoke-VNet`. `Hub-VNet` hosts a Virtual Network Gateway configured with an ExpressRoute connection to on-premises headquarters. You need virtual machines in `Spoke-VNet` to access on-premises resources by traversing the gateway in `Hub-VNet`.\n\nWhat configuration settings must you enable on the respective peering links?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Enable 'Use the remote virtual network's gateway' on `Hub-VNet`, and enable 'Allow gateway transit' on `Spoke-VNet`."},
                {"id": "B", "text": "Enable 'Allow gateway transit' on the peering link from `Hub-VNet` to `Spoke-VNet`, and enable 'Use the remote virtual network's gateway' on the peering link from `Spoke-VNet` to `Hub-VNet`."},
                {"id": "C", "text": "Enable 'Allow forwarded traffic' on both peering links and leave gateway transit disabled."},
                {"id": "D", "text": "Deploy a duplicate Virtual Network Gateway in `Spoke-VNet` with identical configuration."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Configure gateway transit so a spoke VNet can use a hub VNet's VPN/ExpressRoute gateway.",
                "flawedMentalModel": "Inverting the gateway transit settings between hub and spoke.",
                "coreMechanic": "To share a gateway across VNet peering: (1) On the Hub VNet peering (where the gateway lives), enable 'Allow gateway transit'. (2) On the Spoke VNet peering (where no gateway lives), enable 'Use the remote virtual network's gateway'. (A VNet can only use a remote gateway if it does not have a gateway of its own).",
                "distractors": {
                    "A": "Inverts the settings: 'Allow gateway transit' belongs on the Hub, and 'Use remote gateway' belongs on the Spoke.",
                    "C": "'Allow forwarded traffic' allows traffic forwarded by NVAs; it does not provide access to the remote VPN gateway.",
                    "D": "Deploying a gateway in the spoke defeats the architectural purpose of hub-and-spoke sharing and creates unnecessary costs."
                },
                "heuristic": "Gateway sharing across peering: Hub = Allow gateway transit. Spoke = Use remote gateway.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview#gateways-and-on-premises-connectivity"
            }
        },
        {
            "id": "e3-q45",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Application Security Groups (ASGs) Scope and VNet Boundaries",
            "scenario": "You are organizing Network Security Group rules for a multi-tier workload. You create an Application Security Group (ASG) named `asg-web-tier` in `vnet-production`.\n\nYou have web servers deployed in two subnets:\n- `snet-web-primary` in `vnet-production`\n- `snet-web-secondary` in `vnet-dmz` (`vnet-dmz` is globally peered to `vnet-production`)\n\nWhat happens when you attempt to associate the network interfaces of web servers in `snet-web-secondary` (`vnet-dmz`) to `asg-web-tier`?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "The association succeeds because the VNets are connected via global VNet peering."},
                {"id": "B", "text": "The association succeeds, but requires an administrator to restart the VM network interfaces."},
                {"id": "C", "text": "The operation fails; all network interfaces assigned to an Application Security Group MUST reside within the same Virtual Network."},
                {"id": "D", "text": "The association succeeds, but NSG rules referencing the ASG will be evaluated with priority 65500."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Understand whether an Application Security Group (ASG) can group NICs across peered Virtual Networks.",
                "flawedMentalModel": "Assuming Application Security Groups can span multiple Virtual Networks if they are peered.",
                "coreMechanic": "Application Security Groups (ASGs) can group NICs across multiple subnets, but ALL network interfaces assigned to an ASG MUST reside within the exact same Virtual Network. An ASG CANNOT span across multiple VNets, regardless of whether VNet peering or VPN gateways connect them.",
                "distractors": {
                    "A": "VNet peering does not eliminate the strict single-VNet boundary restriction of ASGs.",
                    "B": "Restarting NICs does not bypass Azure Resource Manager schema validation.",
                    "D": "The association is rejected during configuration; it cannot partially succeed."
                },
                "heuristic": "Application Security Groups (ASGs) CANNOT cross VNet boundaries. All NICs in an ASG must be in the SAME VNet.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/application-security-groups"
            }
        },
        {
            "id": "e3-q46",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Bastion Subnet Sizing, Naming, and Inbound NSG Requirements",
            "scenario": "You plan to deploy an Azure Bastion host into `vnet-corp` to enable secure browser-based administrative access to Azure VMs without public IPs. You need to prepare the dedicated subnet for the Bastion resource.\n\nWhat are the strict requirements regarding subnet naming, minimum CIDR prefix size, and mandatory inbound NSG rules for this subnet?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Subnet name: `BastionSubnet`, minimum prefix: `/24`, inbound port 3389 allowed from Internet."},
                {"id": "B", "text": "Subnet name: `AzureBastionSubnet`, minimum prefix: `/28`, inbound port 80 allowed from Internet."},
                {"id": "C", "text": "Subnet name: `snet-bastion`, minimum prefix: `/26`, no NSG allowed on subnet."},
                {"id": "D", "text": "Subnet name must be exactly `AzureBastionSubnet`, minimum prefix must be `/26`, and the NSG on this subnet must allow inbound HTTPS (port 443) from the `Internet` service tag."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Identify exact naming, CIDR sizing, and NSG inbound rule prerequisites for an Azure Bastion subnet.",
                "flawedMentalModel": "Thinking the Bastion subnet is named `BastionSubnet` or requires a smaller `/28` or `/27` prefix.",
                "coreMechanic": "Azure Bastion requires: (1) A subnet named exactly `AzureBastionSubnet` (case-sensitive), (2) A minimum CIDR prefix size of `/26` (or larger, e.g. `/25`), and (3) If an NSG is attached, it MUST allow inbound HTTPS (port 443) from the `Internet` service tag for administrative management sessions, plus GatewayManager (port 443) and AzureLoadBalancer (port 443).",
                "distractors": {
                    "A": "The subnet name must be `AzureBastionSubnet`, not `BastionSubnet`, and Internet RDP (3389) must NOT be exposed to Bastion directly.",
                    "B": "A `/28` prefix is too small; Azure Bastion requires at least a `/26` prefix to support host scale-out.",
                    "C": "The subnet name must be exactly `AzureBastionSubnet`, and NSGs are permitted as long as required Bastion rules are satisfied."
                },
                "heuristic": "Azure Bastion Subnet: Name = AzureBastionSubnet, Minimum size = /26, Inbound = Port 443 (HTTPS) from Internet.",
                "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-nsg"
            }
        },
        {
            "id": "e3-q47",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Load Balancer Session Persistence and Distribution Modes",
            "scenario": "You deploy an Azure Public Standard Load Balancer to distribute traffic across four backend virtual machines running a stateful legacy web application. The application stores user authentication sessions in local VM memory rather than in a centralized Redis cache.\n\nYou need to ensure that when a client establishes a connection, all subsequent requests from that specific client IP address during the session are consistently routed to the same backend VM.\n\nWhich configuration setting should you modify in the Load Balancing rule?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Configure 'Session persistence' to 'Client IP' (or 'Client IP and protocol')."},
                {"id": "B", "text": "Enable 'Floating IP' (Direct Server Return) on the load balancing rule."},
                {"id": "C", "text": "Change the health probe interval from 15 seconds to 5 seconds."},
                {"id": "D", "text": "Attach an Azure Traffic Manager profile using the Priority routing method."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Configure Azure Load Balancer to guarantee sticky sessions from the same client IP.",
                "flawedMentalModel": "Assuming Azure Load Balancer uses cookie-based affinity (cookie affinity is an Application Gateway feature).",
                "coreMechanic": "Azure Load Balancer operates at Layer 4 (TCP/UDP) and does not inspect HTTP cookies. To achieve sticky sessions, it provides 'Session persistence' based on IP hashing: (1) `None` (default 5-tuple hash), (2) `Client IP` (2-tuple hash: source IP and destination IP), and (3) `Client IP and protocol` (3-tuple hash: source IP, destination IP, and transport protocol). Setting it to Client IP ensures repeat traffic from a client hits the same backend VM.",
                "distractors": {
                    "B": "Floating IP is used for SQL Server Always On availability group listeners; it does not control session persistence.",
                    "C": "Probe interval determines how quickly failed instances are removed from rotation, not session affinity.",
                    "D": "Traffic Manager is a DNS-based global router and cannot solve local Layer 4 VM backend session persistence."
                },
                "heuristic": "Layer 4 Load Balancer Sticky Sessions = Session Persistence (Client IP / Client IP and protocol). Cookie affinity is App Gateway!",
                "msLearnUrl": "https://learn.microsoft.com/azure/load-balancer/load-balancer-distribution-mode"
            }
        },
        {
            "id": "e3-q48",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Application Gateway Path-Based Routing Rules and URL Path Maps",
            "scenario": "You deploy an Azure Application Gateway v2 to route incoming traffic for domain `contoso.com`. You have two backend pools:\n- `pool-images` contains VMs optimized for image rendering.\n- `pool-video` contains VMs optimized for media streaming.\n\nYou need requests sent to `https://contoso.com/images/*` to route to `pool-images`, requests to `https://contoso.com/video/*` to route to `pool-video`, and all other requests to route to a default backend pool `pool-general`.\n\nWhich Application Gateway configuration must you implement?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Configure multi-site listeners with separate HTTP listeners for `/images/` and `/video/`."},
                {"id": "B", "text": "Create a path-based routing rule associated with a URL Path Map defining path rules for `/images/*` and `/video/*` and designating `pool-general` as the default pool."},
                {"id": "C", "text": "Create User-Defined Routes (UDRs) on the Application Gateway subnet mapping URL strings to backend private IPs."},
                {"id": "D", "text": "Deploy an Azure Standard Load Balancer with custom health probes."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Route incoming HTTP requests based on URL URI path patterns (/images/*, /video/*) to specific backend pools.",
                "flawedMentalModel": "Attempting to use multi-site listeners for URL paths (multi-site listeners evaluate host headers like `images.contoso.com`, not URI paths).",
                "coreMechanic": "Azure Application Gateway provides Layer 7 routing. Path-based routing uses a URL Path Map attached to a basic or multi-site listener. The URL Path Map evaluates the URL path after the host header (e.g. `/images/*`), directing traffic to designated backend pools and HTTP settings, with unmatched traffic falling back to the default backend pool.",
                "distractors": {
                    "A": "Multi-site listeners evaluate hostnames (e.g. `images.contoso.com`), not URL paths (e.g. `contoso.com/images/`).",
                    "C": "UDRs route IP packets at Layer 3; they have no awareness of HTTP URL strings.",
                    "D": "Standard Load Balancer is Layer 4 (TCP/UDP) and cannot inspect or route based on HTTP URL paths."
                },
                "heuristic": "URL URI path routing (/images/* vs /video/*) = Application Gateway Path-Based Routing with URL Path Map.",
                "msLearnUrl": "https://learn.microsoft.com/azure/application-gateway/url-route-overview"
            }
        },
        {
            "id": "e3-q49",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Private DNS Zone Auto-Registration Limits",
            "scenario": "Your enterprise creates an Azure Private DNS Zone named `corp.internal`. You have four Virtual Networks: `vnet-dev`, `vnet-test`, `vnet-stage`, and `vnet-prod`. You need Azure to automatically register and manage the lifecycle of DNS host A records for all virtual machines deployed across all four virtual networks as VMs are provisioned and deprovisioned.\n\nWhat is the architectural limitation regarding Private DNS auto-registration?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "A private DNS zone can only be linked to a single Virtual Network in total."},
                {"id": "B", "text": "Auto-registration is only supported when using Windows Server Domain Controllers deployed in Azure."},
                {"id": "C", "text": "A private DNS zone supports auto-registration for only ONE Virtual Network at a time; the remaining three VNets can be linked as resolution-only VNets."},
                {"id": "D", "text": "Auto-registration requires all virtual networks to reside in different Azure regions."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Understand the maximum number of VNets that can have auto-registration enabled on a single Private DNS zone.",
                "flawedMentalModel": "Assuming you can check the 'Enable auto registration' box on as many VNets as you want for a single private zone.",
                "coreMechanic": "An Azure Private DNS Zone can be linked to up to 1,000 virtual networks for name resolution. However, auto-registration (automatic creation/deletion of VM A records) can ONLY be enabled on ONE virtual network per private zone. The other VNets must be linked without auto-registration (resolution only).",
                "distractors": {
                    "A": "A private DNS zone can be linked to up to 1,000 VNets for resolution.",
                    "B": "Auto-registration is a native Azure SDN feature that does not require Active Directory domain controllers.",
                    "D": "Regional distribution has no effect on auto-registration limits."
                },
                "heuristic": "Private DNS Zone Limits: 1,000 resolution VNets, but EXACTLY ONE (1) auto-registration VNet per private zone.",
                "msLearnUrl": "https://learn.microsoft.com/azure/dns/private-dns-overview#capabilities"
            }
        },
        {
            "id": "e3-q50",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "User-Defined Routes (UDR) Next Hop Virtual Appliance and Default Route Override",
            "scenario": "You need to force all outbound Internet traffic from subnet `snet-workload` (`10.50.1.0/24`) to route through a central firewall appliance located at private IP `10.50.99.4` in `snet-firewall`.\n\nYou create a Route Table and associate it with `snet-workload`.\n\nWhich route entry must you configure in the Route Table?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Address prefix: `10.50.1.0/24`, Next hop type: `Virtual appliance`, Next hop IP address: `10.50.99.4`."},
                {"id": "B", "text": "Address prefix: `0.0.0.0/0`, Next hop type: `Virtual network gateway`."},
                {"id": "C", "text": "Address prefix: `168.63.129.16/32`, Next hop type: `Internet`."},
                {"id": "D", "text": "Address prefix: `0.0.0.0/0`, Next hop type: `Virtual appliance`, Next hop IP address: `10.50.99.4`."}
            ],
            "correctAnswer": "D",
            "explanation": {
                "verdict": "Option D is correct.",
                "triggerConstraints": "Requirement: Override Azure's default outbound Internet routing to force all traffic through a firewall NVA at 10.50.99.4.",
                "flawedMentalModel": "Configuring the subnet's own prefix (10.50.1.0/24) as the destination instead of the default route 0.0.0.0/0.",
                "coreMechanic": "In Azure routing, default outbound traffic to the Internet is governed by a system route with prefix `0.0.0.0/0` and next hop `Internet`. To override this default behavior and inspect outbound traffic through a firewall, you must define a UDR with destination prefix `0.0.0.0/0`, next hop type `Virtual appliance`, and the NVA's private IP address (`10.50.99.4`).",
                "distractors": {
                    "A": "Routing the subnet's own prefix to the firewall breaks local subnet switching.",
                    "B": "Virtual network gateway is used for ExpressRoute/VPN, not a private NVA/firewall IP.",
                    "C": "`168.63.129.16` is Azure infrastructure IP (DNS/health probes) and should never be routed to an NVA."
                },
                "heuristic": "Force outbound Internet through a firewall: Prefix = 0.0.0.0/0, Next hop = Virtual appliance, Next hop IP = Firewall IP.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#user-defined"
            }
        },
        {
            "id": "e3-q51",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "NSG Inbound Rule Precedence and Evaluation Order Hierarchy",
            "scenario": "A Network Security Group (NSG) attached to subnet `snet-db` has the following custom inbound rule:\n- Priority: `250`\n- Source: `10.20.0.0/16`\n- Source Port: `*`\n- Destination: `*`\n- Destination Port: `1433`\n- Protocol: `TCP`\n- Action: `Deny`\n\nThe subnet also inherits Azure's default inbound rule:\n- Priority: `65000`\n- Name: `AllowVnetInBound`\n- Source: `VirtualNetwork`\n- Destination: `VirtualNetwork`\n- Action: `Allow`\n\nA VM located at IP `10.20.5.12` in the same VNet attempts to connect to a SQL Server database on port 1433 in `snet-db`. Will the connection be allowed or denied, and why?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Denied, because custom rule 250 has a lower numerical priority (higher evaluation precedence) than default rule 65000 and matches the traffic parameters."},
                {"id": "B", "text": "Allowed, because default rule 65000 covers the entire VirtualNetwork tag and overrides custom deny rules."},
                {"id": "C", "text": "Allowed, because traffic originating from within the same VNet is non-routable and bypasses NSGs."},
                {"id": "D", "text": "Denied, because default rule 65500 (DenyAllInBound) evaluates first."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Determine NSG rule evaluation outcome between custom rule 250 (Deny) and default rule 65000 (Allow).",
                "flawedMentalModel": "Assuming lower numbers mean lower priority, or assuming default VNet rules take precedence over custom rules.",
                "coreMechanic": "Azure NSG rules are evaluated sequentially in order of priority from lowest number (100) to highest number (4096). Default rules have priorities 65000, 65001, and 65500. As soon as a rule matches traffic, processing stops and the rule action (Allow or Deny) is applied. Priority 250 evaluates long before priority 65000, so the connection is Denied.",
                "distractors": {
                    "B": "Default rules have the lowest precedence (65000+) and are always superseded by matching custom rules.",
                    "C": "NSGs actively inspect intra-VNet and cross-subnet traffic.",
                    "D": "Priority 65500 is evaluated last, not first."
                },
                "heuristic": "NSG Evaluation: Lower priority number = Higher precedence. First matching rule wins. Default rules (65000+) evaluate last.",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview#security-rules"
            }
        },
        {
            "id": "e3-q52",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Standard Load Balancer Outbound Rules and SNAT Exhaustion Mitigation",
            "scenario": "Your backend virtual machines behind an Azure Public Standard Load Balancer establish hundreds of thousands of concurrent outbound TCP connections to external partner APIs. During peak processing, outbound API calls intermittently time out due to SNAT port exhaustion.\n\nHow can you mitigate SNAT port exhaustion and scale outbound connection capacity using Azure Load Balancer?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Downgrade the Load Balancer to Basic SKU to enable dynamic port recycling."},
                {"id": "B", "text": "Configure explicit Outbound Rules on the Standard Load Balancer, allocate manual ports per instance, and associate multiple frontend public IP addresses to multiply the available SNAT pool."},
                {"id": "C", "text": "Configure an Application Security Group on the backend NICs."},
                {"id": "D", "text": "Change the backend pool health probe protocol from HTTP to TCP."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Resolve outbound SNAT port exhaustion on a Standard Load Balancer backend pool.",
                "flawedMentalModel": "Assuming SNAT port allocation is fixed per VM and cannot be customized with multiple public IPs.",
                "coreMechanic": "Azure Standard Load Balancer supports Outbound Rules. Each frontend public IP address assigned to an outbound rule provides 64,000 ephemeral SNAT ports. By binding multiple public IPs and configuring manual port allocation (or deploying Azure Virtual Network NAT Gateway), administrators can scale outbound SNAT capacity to millions of concurrent flows.",
                "distractors": {
                    "A": "Basic Load Balancer has legacy, inflexible SNAT and is deprecated for modern production architectures.",
                    "C": "Application Security Groups define filtering boundaries, not outbound SNAT port capacities.",
                    "D": "Health probe protocol affects inbound health checking, not outbound SNAT port allocation."
                },
                "heuristic": "Mitigate Load Balancer SNAT Exhaustion: Configure Outbound Rules with multiple frontend Public IPs or use NAT Gateway.",
                "msLearnUrl": "https://learn.microsoft.com/azure/load-balancer/load-balancer-outbound-connections"
            }
        },
        {
            "id": "e3-q53",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Network Watcher IP Flow Verify for Dropped Packets",
            "scenario": "A database administrator reports that application server `vm-app-01` (IP: `10.10.1.4`) cannot establish a database connection to `vm-sql-01` (IP: `10.10.2.10`) on TCP port 1433. You suspect an NSG rule is dropping the traffic, but multiple NSGs are attached at both the subnet and NIC levels.\n\nWhich Azure Network Watcher tool should you use to immediately test packet authorization and identify the EXACT NSG rule responsible for allowing or denying the traffic?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Connection Troubleshoot."},
                {"id": "B", "text": "Next Hop."},
                {"id": "C", "text": "IP Flow Verify."},
                {"id": "D", "text": "NSG Flow Logs."}
            ],
            "correctAnswer": "C",
            "explanation": {
                "verdict": "Option C is correct.",
                "triggerConstraints": "Requirement: Test whether a 5-tuple packet flow is permitted and identify the specific winning NSG rule.",
                "flawedMentalModel": "Choosing Connection Troubleshoot (which tests end-to-end multi-hop connectivity) instead of IP Flow Verify.",
                "coreMechanic": "Network Watcher `IP flow verify` tests 5-tuple flow parameters (Protocol: TCP/UDP, Local IP/Port, Remote IP/Port, Direction: Inbound/Outbound) directly against the effective security rules on a target VM's NIC. It returns an immediate Access: Allowed or Denied decision and names the exact NSG rule that made the decision.",
                "distractors": {
                    "A": "Connection Troubleshoot tests end-to-end hop reachability and latency, but IP flow verify is specifically designed to isolate NSG rule decisions.",
                    "B": "Next Hop checks routing tables and UDRs, not NSG security rules.",
                    "D": "NSG Flow Logs logs historical traffic flows to storage for analysis; it is not an instant diagnostic query tool."
                },
                "heuristic": "Identify the EXACT NSG rule blocking or allowing a flow = Network Watcher IP Flow Verify.",
                "msLearnUrl": "https://learn.microsoft.com/azure/network-watcher/diagnose-vm-network-traffic-filtering-problem"
            }
        },
        {
            "id": "e3-q54",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Virtual Network Peering Prerequisites and Bidirectional State",
            "scenario": "You are establishing a Virtual Network Peering connection between `VNet-Alpha` (`172.16.0.0/16`) in `East US` and `VNet-Beta` (`192.168.0.0/16`) in `West US`.\n\nWhich TWO conditions are MANDATORY for the peering connection status to display `Connected` and allow traffic to flow bidirectionally? (Select TWO)",
            "questionType": "multiple",
            "options": [
                {"id": "A", "text": "Both virtual networks must be deployed in the same Azure region."},
                {"id": "B", "text": "The address spaces of `VNet-Alpha` and `VNet-Beta` must not overlap."},
                {"id": "C", "text": "A Virtual Network Gateway must be provisioned in at least one of the virtual networks."},
                {"id": "D", "text": "Two peering links must be configured: one from `VNet-Alpha` to `VNet-Beta`, and one from `VNet-Beta` to `VNet-Alpha`."},
                {"id": "E", "text": "Both virtual networks must belong to the same Microsoft Entra tenant."}
            ],
            "correctAnswer": ["B", "D"],
            "explanation": {
                "verdict": "Options B and D are correct.",
                "triggerConstraints": "Requirement: Identify mandatory prerequisites to achieve a fully 'Connected' bidirectional VNet peering state.",
                "flawedMentalModel": "Assuming creating a peering link in one direction automatically creates the reciprocal link, or assuming peering cannot cross regions.",
                "coreMechanic": "VNet Peering requires: (1) Completely non-overlapping address spaces across both VNets, and (2) Creating peering links on BOTH virtual networks (Alpha -> Beta AND Beta -> Alpha). When only one link exists, status is `Initiated`; once both are configured, status changes to `Connected`. Global VNet Peering fully supports cross-region connections without gateways.",
                "distractors": {
                    "A": "Global VNet Peering connects VNets across different Azure regions seamlessly.",
                    "C": "VNet peering does not require any Virtual Network Gateways.",
                    "E": "Peering can be established across different Entra tenants using Azure PowerShell/CLI with tenant auth."
                },
                "heuristic": "VNet Peering Prerequisites: Non-overlapping address spaces + TWO reciprocal peering links (Status: Connected).",
                "msLearnUrl": "https://learn.microsoft.com/azure/virtual-network/virtual-network-manage-peering#create-a-peering"
            }
        },
        {
            "id": "e3-q55",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Delegating Public Domains to Azure DNS via Name Server (NS) Records",
            "scenario": "Your company purchases a custom domain name `contosocorp.io` from an external domain registrar. You create an Azure Public DNS Zone named `contosocorp.io` in subscription `sub-prod`.\n\nTo delegate authoritative name resolution of `contosocorp.io` to Azure DNS so that DNS records created in Azure resolve across the public Internet, what action must you take?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "At the registrar, replace the existing Name Server (NS) records with the four authoritative Azure DNS name servers assigned to your public zone (e.g. `ns1-xx.azure-dns.com`, etc.)."},
                {"id": "B", "text": "Create an A record at the registrar pointing to the Azure virtual network gateway public IP."},
                {"id": "C", "text": "Create a CNAME record at the registrar pointing to `trafficmanager.net`."},
                {"id": "D", "text": "Transfer the domain registration to Microsoft using Azure App Service Domain."}
            ],
            "correctAnswer": "A",
            "explanation": {
                "verdict": "Option A is correct.",
                "triggerConstraints": "Requirement: Delegate a domain purchased at a 3rd-party registrar to Azure DNS public hosted zone.",
                "flawedMentalModel": "Attempting to delegate DNS using A records or CNAME records at the registrar.",
                "coreMechanic": "Domain delegation delegates authority for a DNS zone from the parent registrar down to Azure DNS. When you create a Public DNS Zone in Azure, Azure assigns four authoritative name servers (e.g. `ns1-09.azure-dns.com`, `ns2-09.azure-dns.net`, etc.). You must update the registrar's NS records with these exact four nameserver addresses.",
                "distractors": {
                    "B": "An A record points a specific hostname to an IP; it does not delegate zone authority.",
                    "C": "CNAME points one hostname to another; it cannot delegate root zone DNS authority.",
                    "D": "Transferring registration is an administrative ownership transfer, not required for simple DNS delegation."
                },
                "heuristic": "Delegate a domain to Azure DNS: Update registrar's NS records with the 4 Azure DNS Name Servers.",
                "msLearnUrl": "https://learn.microsoft.com/azure/dns/dns-delegate-domain-azure-dns"
            }
        },
        {
            "id": "e3-q56",
            "examNumber": 3,
            "domain": "Domain 4: Implement and manage virtual networking",
            "domainCode": 4,
            "topic": "Azure Bastion SKU Capabilities: Standard Native Client Support",
            "scenario": "Your infrastructure engineering team currently connects to Azure virtual machines via Azure Bastion using the web browser interface in the Azure Portal. The team demands the ability to connect using native desktop tools (such as Windows `mstsc.exe` for RDP and local OpenSSH client in Linux terminals) as well as transfer files via native SSH.\n\nWhich Azure Bastion tier and feature must be configured?",
            "questionType": "single",
            "options": [
                {"id": "A", "text": "Azure Bastion Basic SKU with an Application Gateway in front."},
                {"id": "B", "text": "Upgrade to Azure Bastion Standard (or Premium) SKU and enable the 'Native client support' feature."},
                {"id": "C", "text": "Deploy a Point-to-Site VPN Gateway on the Bastion subnet."},
                {"id": "D", "text": "Azure Bastion Developer SKU with an inbound NSG rule allowing port 22."}
            ],
            "correctAnswer": "B",
            "explanation": {
                "verdict": "Option B is correct.",
                "triggerConstraints": "Requirement: Enable native desktop client connectivity (mstsc / ssh) through Azure Bastion.",
                "flawedMentalModel": "Assuming native client support is available on Basic or Developer Bastion tiers.",
                "coreMechanic": "Native client support (which allows connecting via `az network bastion rdp` or `az network bastion ssh` to launch local desktop clients like `mstsc.exe` or terminal SSH) is an advanced feature available EXCLUSIVELY on Azure Bastion Standard and Premium SKUs. It is NOT supported on Developer or Basic SKUs.",
                "distractors": {
                    "A": "Basic SKU does NOT support native client connectivity; it is strictly browser-based.",
                    "C": "VPN Gateways provide network-level tunnel connectivity and bypass Bastion architecture.",
                    "D": "Developer SKU only supports single VM browser access without native client integration."
                },
                "heuristic": "Azure Bastion with Native Desktop Clients (mstsc / native SSH) = Bastion Standard SKU + Native client support.",
                "msLearnUrl": "https://learn.microsoft.com/azure/bastion/bastion-native-client"
            }
        }
    ]
