# 📅 Day 4: Computer Networking - How Data Travels the Internet

**Module:** Systems & Architecture (Days 1-5)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - conceptual with practical tools)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- How a UPI payment travels from your phone to bank servers
- The 7-layer OSI model and why it matters
- TCP vs UDP and when to use each
- IP addresses, subnetting, and routing basics
- How to troubleshoot network issues like a pro

**Real-world relevance:** Essential for Backend Development, API design, Cloud Engineering, Cybersecurity, and understanding how all web/mobile apps communicate.

---

## 📚 Theory (45-60 minutes)

### **1. The OSI Model - 7 Layers of Communication**

When you send a UPI payment, data passes through 7 layers:

```
YOUR PHONE (PhonePe App)
│
├─ Layer 7: APPLICATION  → UPI payment request
├─ Layer 6: PRESENTATION → Encryption (HTTPS)
├─ Layer 5: SESSION      → Connection management
├─ Layer 4: TRANSPORT    → TCP (reliable) or UDP (fast)
├─ Layer 3: NETWORK      → IP routing (find NPCI server)
├─ Layer 2: DATA LINK    → WiFi/4G frame
├─ Layer 1: PHYSICAL     → Radio waves / Optical fiber
│
INTERNET
│
NPCI SERVERS (Bank Backend)
```

**Mnemonic:** **"All People Seem To Need Data Processing"**  
(Application, Presentation, Session, Transport, Network, Data Link, Physical)

---

### **2. Layer-by-Layer Breakdown**

#### **Layer 7: Application** (What you interact with)
- **Protocols:** HTTP, HTTPS, FTP, SMTP, DNS
- **Examples:** 
  - Web browser → HTTP/HTTPS
  - Email → SMTP
  - File transfer → FTP

**Indian Example:** WhatsApp message uses **HTTP/2** at application layer

---

#### **Layer 4: Transport** (How data is delivered)

**TCP (Transmission Control Protocol):**
```
Client                    Server
  │                         │
  ├─── SYN ────────────────►│  (Want to connect?)
  │◄─── SYN-ACK ───────────┤  (Sure, ready!)
  ├─── ACK ────────────────►│  (Great, let's talk!)
  │                         │
  │◄──── DATA ─────────────►│  (Reliable transfer)
  │                         │
```

**Features:**
- ✅ **Reliable:** Guarantees delivery
- ✅ **Ordered:** Packets arrive in order
- ⚠️ **Slow:** Overhead of verification

**Use Cases:**
- File downloads (can't lose any data)
- Banking transactions (UPI must be reliable!)
- Email, web browsing

---

**UDP (User Datagram Protocol):**
```
Client                    Server
  │                         │
  ├─── DATA ──────────────►│  (Send and forget!)
  ├─── DATA ──────────────►│  (No acknowledgment)
  │                         │
  │  (Some packets may be lost, who cares!)
```

**Features:**
- ✅ **Fast:** No handshake overhead
- ⚠️ **Unreliable:** No guarantee of delivery
- ⚠️ **Unordered:** Packets may arrive mixed up

**Use Cases:**
- Video calls (Zoom, Google Meet - a few dropped frames OK)
- Online gaming (speed > perfection)
- Live streaming (Netflix uses UDP-based QUIC)

---

**TCP vs UDP Comparison:**

| Feature | TCP | UDP |
|---------|-----|-----|
| **Speed** | Slower | Faster |
| **Reliability** | Guaranteed delivery | Best effort |
| **Order** | Ordered | May be unordered |
| **Use Case** | Banking, Downloads | Video calls, Gaming |
| **Indian Example** | UPI Payment | Hotstar live cricket |

---

#### **Layer 3: Network** (IP Addressing & Routing)

**IPv4 Address:** 4 numbers (0-255) separated by dots
```
Example: 192.168.1.100
         └─┬─┘ └┬┘ └┬┘ └─┬─┘
    Network   Subnet    Host
```

**Public vs Private IP:**
- **Public:** Unique across entire internet (e.g., Google's 8.8.8.8)
- **Private:** Local network only (e.g., your home WiFi 192.168.x.x)

**Indian Example:**
```
Your Phone: 192.168.1.50 (Private - inside your home WiFi)
     ↓
Router NAT: Converts to Public IP (e.g., 103.45.67.89)
     ↓
NPCI Server: 202.54.1.10 (Public IP)
```

**Subnetting Example:**
```
192.168.1.0/24
            └── /24 means first 24 bits are network, last 8 bits are host
            
Network: 192.168.1.0
Usable IPs: 192.168.1.1 to 192.168.1.254 (254 hosts)
Broadcast: 192.168.1.255
```

---

### **3. Real-World Data Journey: UPI Payment**

Let's trace a ₹500 UPI payment from PhonePe:

```
1. APPLICATION LAYER:
   You: Click "Pay ₹500"
   PhonePe app: Creates HTTP POST request with payment details

2. PRESENTATION LAYER:
   Encrypts data with TLS/SSL (HTTPS)
   Plain text → Encrypted cipher

3. SESSION LAYER:
   Maintains HTTPS session
   Keeps connection alive for response

4. TRANSPORT LAYER:
   Breaks data into TCP segments
   Adds port number (443 for HTTPS)
   Ensures reliable delivery

5. NETWORK LAYER:
   Adds IP addresses:
   Source: Your phone's public IP
   Destination: NPCI server IP (202.x.x.x)

6. DATA LINK LAYER:
   Wraps in 4G/WiFi frame
   Adds MAC addresses

7 PHYSICAL LAYER:
   Converts to radio waves (4G tower)
   → Optical fiber (ISP backbone)
   → Reaches NPCI data center

NPCI receives → Processes → Sends back confirmation
(Reverse journey through all 7 layers)

Your PhonePe: "Payment Successful!" ✓
```

**Time:** ~2-3 seconds for entire journey with network latency!

---

### **4. DNS - The Internet's Phone Book**

When you type `google.com`, how does browser find Google's servers?

```
Step 1: Check browser cache
   ↓ (not found)
Step 2: Check OS cache
   ↓ (not found)
Step 3: Ask DNS Resolver (your ISP)
   ↓
Step 4: Root DNS Server → "Try .com servers"
   ↓
Step 5: TLD Server (.com) → "Google's DNS is at X"
   ↓
Step 6: Google's Authoritative DNS → "google.com = 142.250.192.46"
   ↓
Browser connects to 142.250.192.46
```

**Indian Example:**
```
paytm.com → DNS → 103.147.x.x (Paytm servers in India)
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Network Exploration** (20 mins)

**Write `network_info.py`:**
```python
import socket
import requests

print("=== Your Network Information ===\n")

# 1. Your computer's hostname
hostname = socket.gethostname()
print(f"1. Hostname: {hostname}")

# 2. Local IP address (private)
local_ip = socket.gethostbyname(hostname)
print(f"2. Local (Private) IP: {local_ip}")

# 3. Public IP address
try:
    public_ip = requests.get('https://api.ipify.org).text
    print(f"3. Public IP: {public_ip}")
except:
    print("3. Public IP: (Unable to fetch)")

# 4. DNS resolution
print("\n=== DNS Resolution ===")
websites = ['google.com', 'paytm.com', 'flipkart.com']
for site in websites:
    try:
        ip = socket.gethostbyname(site)
        print(f"{site:15} → {ip}")
    except:
        print(f"{site:15} → Unable to resolve")

# 5. Check if a port is open
def check_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

print("\n=== Port Scanning google.com ===")
ports = [80, 443, 22, 3306]
port_names = {80: 'HTTP', 443: 'HTTPS', 22: 'SSH', 3306: 'MySQL'}
for port in ports:
    status = "OPEN" if check_port('google.com', port) else "CLOSED"
    print(f"Port {port} ({port_names[port]:6}): {status}")
```

**Install:** `pip install requests`  
**Run:** `python network_info.py`

---

### **Task 2: TCP vs UDP Speed Test** (25 mins)

**Write `tcp_vs_udp_server.py`:**
```python
import socket
import time

# TCP Server
def tcp_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(('localhost', 9999))
    server.listen(1)
    print("TCP Server listening on port 9999...")
    
    conn, addr = server.accept()
    print(f"Connected by {addr}")
    
    start = time.time()
    data_received = 0
    
    while True:
        data = conn.recv(1024)
        if not data:
            break
        data_received += len(data)
    
    elapsed = time.time() - start
    print(f"TCP: Received {data_received:,} bytes in {elapsed:.4f}s")
    print(f"TCP Speed: {data_received/elapsed/1024/1024:.2f} MB/s")
    
    conn.close()
    server.close()

# UDP Server
def udp_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind(('localhost', 9998))
    print("UDP Server listening on port 9998...")
    
    start = time.time()
    data_received = 0
    
    while True:
        data, addr = server.recvfrom(1024)
        if data == b'END':
            break
        data_received += len(data)
    
    elapsed = time.time() - start
    print(f"UDP: Received {data_received:,} bytes in {elapsed:.4f}s")
    print(f"UDP Speed: {data_received/elapsed/1024/1024:.2f} MB/s")
    
    server.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python tcp_vs_udp_server.py [tcp|udp]")
    elif sys.argv[1] == 'tcp':
        tcp_server()
    elif sys.argv[1] == 'udp':
        udp_server()
```

**Write `tcp_vs_udp_client.py`:**
```python
import socket

def tcp_client():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(('localhost', 9999))
    
    # Send 10 MB of data
    data = b'X' * 1024  # 1 KB
    for _ in range(10000):  # 10 MB total
        client.sendall(data)
    
    client.close()
    print("TCP: Sent 10 MB")

def udp_client():
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # Send 10 MB of data
    data = b'X' * 1024
    for _ in range(10000):
        client.sendto(data, ('localhost', 9998))
    
    client.sendto(b'END', ('localhost', 9998))
    client.close()
    print("UDP: Sent 10 MB")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python tcp_vs_udp_client.py [tcp|udp]")
    elif sys.argv[1] == 'tcp':
        tcp_client()
    elif sys.argv[1] == 'udp':
        udp_client()
```

**Run:**
```bash
# Terminal 1:
python tcp_vs_udp_server.py tcp

# Terminal 2:
python tcp_vs_udp_client.py tcp

# Then repeat with 'udp'
```

**Observe:** UDP is faster but may lose some packets!

---

### **Task 3: Trace Your Data's Journey** (15 mins)

**Windows:**
```powershell
# Ping google.com (check connectivity)
ping google.com

# Trace route to google.com
tracert google.com

# DNS lookup
nslookup paytm.com
```

**Mac/Linux:**
```bash
# Ping
ping google.com

# Traceroute
traceroute google.com

# DNS lookup
dig paytm.com
# or
nslookup paytm.com
```

**Document in `day04_network_trace.md`:**
```markdown
# Network Trace Results

## Ping to google.com:
- Latency: X ms
- Packet loss: 0%

## Traceroute hops:
1. 192.168.1.1 (my router)
2. 10.x.x.x (ISP)
3. ...
4. google.com

Total hops: X
Insight: Data passed through X routers!

## DNS Resolution (paytm.com):
- IP Address: X.X.X.X
- DNS Server used: Y.Y.Y.Y
```

---

### **Task 4: Build a Simple HTTP Server** (20 mins)

**Write `simple_http_server.py`:**
```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class SimpleHTTPHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = """
            <html>
            <body>
                <h1>Hello from Python HTTP Server! 🚀</h1>
                <p>This is running on Layer 7 (Application Layer)</p>
                <p>Using HTTP protocol over TCP</p>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
        
        elif self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            data = {
                "message": "Hello from API!",
                "payment_status": "success",
                "amount": 500
            }
            self.wfile.write(json.dumps(data).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'404 Not Found')
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        print(f"Received POST data: {post_data.decode()}")
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {"status": "received", "data_length": content_length}
        self.wfile.write(json.dumps(response).encode())

if __name__ == "__main__":
    server = HTTPServer(('localhost', 8000), SimpleHTTPHandler)
    print("Server running on http://localhost:8000")
    print("Try visiting: http://localhost:8000 or http://localhost:8000/api/data")
    server.serve_forever()
```

**Run:** `python simple_http_server.py`  
**Test:** Open browser → `http://localhost:8000`

**Test POST with Python:**
```python
import requests

response = requests.post('http://localhost:8000', 
                          json={"transaction_id": "UPI123", "amount": 500})
print(response.json())
```

---

### **Task 5: IP Subnet Calculator** (15 mins)

**Write `subnet_calculator.py`:**
```python
def ip_to_binary(ip):
    """Convert IP to binary"""
    octets = ip.split('.')
    binary = '.'.join([format(int(octet), '08b') for octet in octets])
    return binary

def calculate_subnet(ip, prefix):
    """Calculate subnet details"""
    # Convert IP to integer
    octets = [int(x) for x in ip.split('.')]
    ip_int = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
    
    # Calculate network and broadcast
    host_bits = 32 - prefix
    network_int = ip_int & (~((1 << host_bits) - 1))
    broadcast_int = network_int | ((1 << host_bits) - 1)
    
    # Convert back to dotted notation
    def int_to_ip(n):
        return f"{(n >> 24) & 255}.{(n >> 16) & 255}.{(n >> 8) & 255}.{n & 255}"
    
    network = int_to_ip(network_int)
    broadcast = int_to_ip(broadcast_int)
    first_host = int_to_ip(network_int + 1)
    last_host = int_to_ip(broadcast_int - 1)
    total_hosts = (1 << host_bits) - 2
    
    return {
        'network': network,
        'broadcast': broadcast,
        'first_host': first_host,
        'last_host': last_host,
        'total_hosts': total_hosts
    }

# Example
ip = "192.168.1.100"
prefix = 24

print(f"IP Address: {ip}/{prefix}")
print(f"Binary:     {ip_to_binary(ip)}")
print()

subnet = calculate_subnet(ip, prefix)
print("Subnet Information:")
print(f"Network Address:   {subnet['network']}")
print(f"First Usable Host: {subnet['first_host']}")
print(f"Last Usable Host:  {subnet['last_host']}")
print(f"Broadcast Address: {subnet['broadcast']}")
print(f"Total Usable Hosts: {subnet['total_hosts']:,}")
```

---

## ✅ Verification Checklist

Before moving to Day 5, ensure you can answer:

- [ ] What are the 7 layers of the OSI model?
- [ ] Explain the TCP 3-way handshake
- [ ] When would you use UDP instead of TCP?
- [ ] What is the difference between public and private IP?
- [ ] How does DNS work?
- [ ] What is a subnet and why is it useful?
- [ ] Trace the journey of a UPI payment through network layers

**Self-Test:** Explain to a friend how a WhatsApp message travels from your phone to your friend's phone through the network layers.

---

## 📖 Resources

### **Video Tutorials:**
- **Computerphile:** "How the Internet Works" series
- **Networking Fundas:** OSI Model explained (Hindi)
- **PowerCert:** TCP vs UDP animation

### **Interactive:**
- **Packet Tracer:** Cisco's network simulator
- **Wireshark:** Capture real network packets

### **Reading:**
- **GeeksforGeeks:** Computer Networks
- **Cloudflare Learning:** networking basics

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **Backend Developer** | API design, understanding client-server communication |
| **DevOps** | Network troubleshooting, firewall rules, load balancing |
| **Cybersecurity** | Network attacks (DDoS, Man-in-the-Middle), packet analysis |
| **Cloud Engineer** | VPC setup, security groups, network architecture |
| **Full Stack** | Understanding HTTP, WebSockets, API protocols |
| **IoT Engineer** | Low-power protocols, MQTT, device communication |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 4!** 🎉

### **Before Day 5:**
1. Push to GitHub
   ```bash
   git add .
   git commit -m "Day 4: Networking - OSI model, TCP/UDP, HTTP server"
   git push
   ```

2. Update Progress Tracker

3. Share:
   ```
   Day 4/30: Computer Networking ✅
   
   Built my own HTTP server in Python!
   TCP vs UDP? TCP is reliable, UDP is fast
   
   Now I understand how my UPI payment travels through 7 network layers
   
   #30DaysOfCode #Networking
   ```

4. **Tomorrow:** Day 5 - HTTP, DNS, and Web Protocols (how browsers really work!)

---

Fun Fact:** The average UPI transaction in India travels through 15-20 network hops from phone to bank! 🏦

[← Day 3: Memory Management](./Day%2003%20-%20Memory%20Management.md) | [Day 5: Internet & HTTP →](./Day%2005%20-%20The%20Internet%20&%20HTTP.md)
