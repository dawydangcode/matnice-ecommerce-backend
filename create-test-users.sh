#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api/v1"

echo -e "${BLUE}🏗️  Creating Test Users for Permission Testing${NC}"
echo "================================================="

# Check if server is running
if ! curl -s "$BASE_URL/test-permissions/guest/products" > /dev/null 2>&1; then
    if ! curl -s "$BASE_URL/products/cards" > /dev/null 2>&1; then
        echo -e "❌ ${RED}Server is not running${NC}"
        echo -e "   Please start the server: ${YELLOW}npm run start:dev${NC}"
        exit 1
    fi
fi

echo -e "✅ Server is running"

# Function to create user
create_user() {
    local email=$1
    local password=$2
    local role_name=$3
    local first_name=$4
    
    echo -e "\n${YELLOW}Creating $role_name: $email${NC}"
    
    local response=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"firstName\": \"$first_name\",
            \"lastName\": \"Test\",
            \"phone\": \"0123456789\"
        }")
    
    local status_code=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"firstName\": \"$first_name\",
            \"lastName\": \"Test\",
            \"phone\": \"0123456789\"
        }" \
        -w "%{http_code}" -o /dev/null)
    
    if [ "$status_code" = "201" ] || [ "$status_code" = "200" ]; then
        echo -e "✅ ${GREEN}Successfully created $role_name${NC}"
    elif [ "$status_code" = "409" ] || [ "$status_code" = "400" ]; then
        echo -e "⚠️  ${YELLOW}$role_name already exists${NC}"
    else
        echo -e "❌ ${RED}Failed to create $role_name${NC} (Status: $status_code)"
    fi
}

# Test login function
test_login() {
    local email=$1
    local password=$2
    local role_name=$3
    
    echo -e "\n${YELLOW}Testing login for $role_name${NC}"
    
    local response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    local status_code=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        -w "%{http_code}" -o /dev/null)
    
    if [ "$status_code" = "200" ]; then
        echo -e "✅ ${GREEN}Login successful for $role_name${NC}"
        
        # Extract token (adjust field name based on your API)
        local token=$(echo $response | jq -r '.accessToken // .token // .access_token // empty' 2>/dev/null)
        if [ ! -z "$token" ] && [ "$token" != "null" ]; then
            echo -e "   Token: ${token:0:20}..."
            
            # Export token as environment variable
            export "${role_name^^}_TOKEN"="$token"
            echo -e "   Exported: ${role_name^^}_TOKEN"
        fi
    else
        echo -e "❌ ${RED}Login failed for $role_name${NC} (Status: $status_code)"
    fi
}

echo -e "\n${BLUE}Creating test accounts...${NC}"

# Create test users
create_user "testuser@matnice.com" "testuser123" "user" "Test User"
create_user "testadmin@matnice.com" "testadmin123" "admin" "Test Admin"
create_user "testemployee@matnice.com" "testemployee123" "employee" "Test Employee"

echo -e "\n${BLUE}Testing login...${NC}"

# Test login for each user
test_login "testuser@matnice.com" "testuser123" "user"
test_login "testadmin@matnice.com" "testadmin123" "admin"
test_login "testemployee@matnice.com" "testemployee123" "employee"

echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo "==================="
echo -e "${YELLOW}Test Credentials:${NC}"
echo ""
echo -e "${BLUE}👤 User Account${NC}"
echo "   Email: testuser@matnice.com"
echo "   Password: testuser123"
echo ""
echo -e "${BLUE}👑 Admin Account${NC}"
echo "   Email: testadmin@matnice.com"
echo "   Password: testadmin123"
echo ""
echo -e "${BLUE}👥 Employee Account${NC}"
echo "   Email: testemployee@matnice.com"
echo "   Password: testemployee123"
echo ""

if [ ! -z "$USER_TOKEN" ]; then
    echo -e "${YELLOW}Environment Variables Set:${NC}"
    echo "   USER_TOKEN=${USER_TOKEN:0:20}..."
    [ ! -z "$ADMIN_TOKEN" ] && echo "   ADMIN_TOKEN=${ADMIN_TOKEN:0:20}..."
    [ ! -z "$EMPLOYEE_TOKEN" ] && echo "   EMPLOYEE_TOKEN=${EMPLOYEE_TOKEN:0:20}..."
    echo ""
    echo -e "${YELLOW}You can now run:${NC}"
    echo "   ./test-permissions.sh"
fi
