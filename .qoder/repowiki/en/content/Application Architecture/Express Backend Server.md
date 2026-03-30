# Express Backend Server

<cite>
**Referenced Files in This Document**
- [index.js](file://server/index.js)
- [package.json](file://server/package.json)
- [connectDB.js](file://server/db/connectDB.js)
- [User.js](file://server/models/User.js)
- [Recipe.js](file://server/models/Recipe.js)
- [userController.js](file://server/controllers/userController.js)
- [recipeController.js](file://server/controllers/recipeController.js)
- [userRoutes.js](file://server/routes/userRoutes.js)
- [recipeRoutes.js](file://server/routes/recipeRoutes.js)
- [auth.js](file://server/middleware/auth.js)
- [errorHandler.js](file://server/middleware/errorHandler.js)
- [validator.js](file://server/middleware/validator.js)
- [apiResponse.js](file://server/utils/apiResponse.js)
- [asyncHandler.js](file://server/utils/asyncHandler.js)
- [generateToken.js](file://server/utils/generateToken.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive documentation for the Flavora Express backend server, a social recipe sharing platform. The backend is built with Node.js, Express, and MongoDB using Mongoose for data modeling. It implements modern development practices including modular architecture, comprehensive validation, authentication middleware, and standardized API responses.

The server supports core social features including user registration and authentication, recipe creation and management, social interactions (likes, saves, follows), and content discovery through search and trending functionality.

## Project Structure
The backend follows a clean, modular architecture organized by concerns:

```mermaid
graph TB
subgraph "Server Root"
A[index.js]
B[package.json]
end
subgraph "Core Modules"
C[controllers/]
D[models/]
E[routes/]
F[middleware/]
G[utils/]
H[db/]
end
A --> C
A --> D
A --> E
A --> F
A --> G
A --> H
C --> C1[userController.js]
C --> C2[recipeController.js]
D --> D1[User.js]
D --> D2[Recipe.js]
E --> E1[userRoutes.js]
E --> E2[recipeRoutes.js]
F --> F1[auth.js]
F --> F2[errorHandler.js]
F --> F3[validator.js]
G --> G1[apiResponse.js]
G --> G2[asyncHandler.js]
G --> G3[generateToken.js]
G --> G4[pagination.js]
G --> G5[seedData.js]
H --> H1[connectDB.js]
```

**Diagram sources**
- [index.js:1-82](file://server/index.js#L1-L82)
- [package.json:1-35](file://server/package.json#L1-L35)

**Section sources**
- [index.js:1-82](file://server/index.js#L1-L82)
- [package.json:1-35](file://server/package.json#L1-L35)

## Core Components

### Database Connection Management
The application uses a centralized database connection module that handles MongoDB Atlas connectivity with robust error handling and disconnection capabilities.

```mermaid
sequenceDiagram
participant App as "Express App"
participant DB as "Database Module"
participant Mongo as "MongoDB Atlas"
App->>DB : connectDB()
DB->>Mongo : Establish connection
Mongo-->>DB : Connection established
DB-->>App : Log connection details
Note over App,Mongo : Connection pooling and error handling
```

**Diagram sources**
- [connectDB.js:7-19](file://server/db/connectDB.js#L7-L19)

### Authentication System
The authentication middleware implements JWT-based security with three protection levels: public routes, protected routes requiring authentication, and admin-only routes.

```mermaid
flowchart TD
A[Incoming Request] --> B{Has Bearer Token?}
B --> |No| C[Optional Auth Check]
B --> |Yes| D[Verify JWT Token]
D --> E{Token Valid?}
E --> |No| F[Return 401 Unauthorized]
E --> |Yes| G[Fetch User from DB]
G --> H{User Active?}
H --> |No| F
H --> |Yes| I[Attach User to Request]
C --> J[Continue to Route Handler]
I --> J
F --> K[Error Response]
J --> L[Execute Route Handler]
L --> M[Success Response]
```

**Diagram sources**
- [auth.js:9-49](file://server/middleware/auth.js#L9-L49)

**Section sources**
- [connectDB.js:1-35](file://server/db/connectDB.js#L1-L35)
- [auth.js:1-105](file://server/middleware/auth.js#L1-L105)

## Architecture Overview

The backend implements a layered architecture pattern with clear separation of concerns:

```mermaid
graph TB
subgraph "Presentation Layer"
A[HTTP Requests]
B[Express Router]
end
subgraph "Application Layer"
C[Controllers]
D[Middleware]
end
subgraph "Domain Layer"
E[Models]
F[Business Logic]
end
subgraph "Infrastructure Layer"
G[Database]
H[External Services]
end
A --> B
B --> C
B --> D
C --> F
D --> F
F --> E
E --> G
F --> H
subgraph "Security Layer"
I[JWT Authentication]
J[Input Validation]
K[Error Handling]
end
D --> I
D --> J
D --> K
```

**Diagram sources**
- [index.js:18-59](file://server/index.js#L18-L59)
- [userController.js:13-53](file://server/controllers/userController.js#L13-L53)
- [recipeController.js:12-51](file://server/controllers/recipeController.js#L12-L51)

### API Endpoint Structure
The RESTful API follows consistent patterns with clear resource organization:

```mermaid
graph LR
subgraph "User Resources"
A[/api/users/register]
B[/api/users/login]
C[/api/users/me]
D[/api/users/:id/follow]
E[/api/users/:id/followers]
F[/api/users/:id/following]
G[/api/users/search]
end
subgraph "Recipe Resources"
H[/api/recipes]
I[/api/recipes/:id]
J[/api/recipes/:id/like]
K[/api/recipes/:id/save]
L[/api/recipes/:id/rate]
M[/api/recipes/:id/comments]
N[/api/recipes/trending]
O[/api/recipes/feed]
end
```

**Diagram sources**
- [userRoutes.js:21-37](file://server/routes/userRoutes.js#L21-L37)
- [recipeRoutes.js:28-53](file://server/routes/recipeRoutes.js#L28-L53)

**Section sources**
- [index.js:47-59](file://server/index.js#L47-L59)
- [userRoutes.js:1-40](file://server/routes/userRoutes.js#L1-L40)
- [recipeRoutes.js:1-56](file://server/routes/recipeRoutes.js#L1-L56)

## Detailed Component Analysis

### User Model and Business Logic
The User model implements comprehensive user management with social features and data validation.

```mermaid
classDiagram
class User {
+string name
+string username
+string email
+string password
+string avatar
+string bio
+ObjectId[] followers
+ObjectId[] following
+ObjectId[] savedRecipes
+ObjectId[] likedRecipes
+boolean isActive
+string role
+comparePassword(candidatePassword) boolean
+getPublicProfile() object
+isFollowing(userId) boolean
+hasSavedRecipe(recipeId) boolean
+hasLikedRecipe(recipeId) boolean
}
class UserMethods {
<<interface>>
+comparePassword()
+getPublicProfile()
+isFollowing()
+hasSavedRecipe()
+hasLikedRecipe()
}
User ..|> UserMethods
class UserVirtuals {
<<virtual>>
+followerCount number
+followingCount number
}
User ..|> UserVirtuals
```

**Diagram sources**
- [User.js:4-142](file://server/models/User.js#L4-L142)

#### User Registration Flow
```mermaid
sequenceDiagram
participant Client as "Client"
participant Controller as "UserController"
participant Model as "User Model"
participant DB as "MongoDB"
participant Token as "JWT Generator"
Client->>Controller : POST /api/users/register
Controller->>Model : Check existing user
Model->>DB : findOne({$or : [email, username]})
DB-->>Model : User exists?
alt User exists
Model-->>Controller : Return exists
Controller-->>Client : 400 Error
else New user
Model->>DB : create(user)
DB-->>Model : User created
Model-->>Controller : User object
Controller->>Token : generateToken(userId)
Token-->>Controller : JWT token
Controller-->>Client : Success response with token
end
```

**Diagram sources**
- [userController.js:13-53](file://server/controllers/userController.js#L13-L53)
- [generateToken.js:8-14](file://server/utils/generateToken.js#L8-L14)

**Section sources**
- [User.js:1-142](file://server/models/User.js#L1-L142)
- [userController.js:1-359](file://server/controllers/userController.js#L1-L359)

### Recipe Model and Advanced Features
The Recipe model implements complex recipe management with nested documents and advanced aggregation capabilities.

```mermaid
erDiagram
RECIPE {
ObjectId user FK
string title
string description
string image
string cuisine
number prepTime
number servings
array ingredients
array instructions
array alternativeIngredients
array likes
array comments
array saves
array ratings
array tags
string difficulty
boolean isPublished
date createdAt
date updatedAt
}
INGREDIENT {
string name
string amount
string unit
}
INSTRUCTION {
number step
string title
string detail
}
COMMENT {
ObjectId user FK
string text
date createdAt
date updatedAt
}
RATING {
ObjectId user FK
number rating
}
USER {
ObjectId _id PK
string name
string username
string email
}
RECIPE ||--|| USER : "created_by"
RECIPE ||--o{ INGREDIENT : "contains"
RECIPE ||--o{ INSTRUCTION : "has_steps"
RECIPE ||--o{ COMMENT : "has_comments"
RECIPE ||--o{ RATING : "has_ratings"
RECIPE ||--o{ USER : "liked_by"
RECIPE ||--o{ USER : "saved_by"
```

**Diagram sources**
- [Recipe.js:3-243](file://server/models/Recipe.js#L3-L243)

#### Recipe Search and Filtering
```mermaid
flowchart TD
A[Search Request] --> B[Parse Query Parameters]
B --> C{Has Search Term?}
C --> |Yes| D[Build Text Search Query]
C --> |No| E[Build Basic Query]
D --> F[Apply Filters]
E --> F
F --> G[Add Sorting]
G --> H[Apply Pagination]
H --> I[Populate User Data]
I --> J[Enhance with User-Specific Data]
J --> K[Return Results]
subgraph "Query Builder"
L[Text Search: title, description, tags]
M[Filter: cuisine, difficulty, prepTime]
N[Sort: createdAt desc, likes desc]
O[Pagination: skip, limit]
end
F -.-> L
F -.-> M
G -.-> N
H -.-> O
```

**Diagram sources**
- [recipeController.js:58-96](file://server/controllers/recipeController.js#L58-L96)
- [Recipe.js:219-238](file://server/models/Recipe.js#L219-L238)

**Section sources**
- [Recipe.js:1-243](file://server/models/Recipe.js#L1-L243)
- [recipeController.js:1-533](file://server/controllers/recipeController.js#L1-L533)

### Authentication and Authorization Middleware
The authentication system provides multiple layers of security:

```mermaid
flowchart TD
A[Route Request] --> B{Route Type?}
B --> |Public| C[Skip Auth]
B --> |Protected| D[Apply protect middleware]
B --> |Admin| E[Apply adminOnly middleware]
D --> F{JWT Token Present?}
F --> |No| G[401 Unauthorized]
F --> |Yes| H[Verify Token]
H --> I{Valid Token?}
I --> |No| G
I --> |Yes| J[Fetch User]
J --> K{User Active?}
K --> |No| G
K --> |Yes| L[Attach User to Request]
E --> M{User Role == admin?}
M --> |No| G
M --> |Yes| L
C --> N[Proceed to Controller]
L --> N
G --> O[Error Response]
```

**Diagram sources**
- [auth.js:9-84](file://server/middleware/auth.js#L9-L84)

**Section sources**
- [auth.js:1-105](file://server/middleware/auth.js#L1-L105)

### Input Validation System
The validation middleware ensures data integrity through comprehensive field validation:

```mermaid
sequenceDiagram
participant Client as "Client"
participant Validator as "Validator Middleware"
participant Controller as "Controller"
participant Model as "Model"
Client->>Validator : Request with data
Validator->>Validator : Validate fields
Validator->>Validator : Check data types
Validator->>Validator : Apply format checks
alt Validation fails
Validator-->>Client : 400 Validation Error
else Validation passes
Validator->>Controller : Next()
Controller->>Model : Process request
Model-->>Controller : Result
Controller-->>Client : Success Response
end
```

**Diagram sources**
- [validator.js:7-20](file://server/middleware/validator.js#L7-L20)

**Section sources**
- [validator.js:1-211](file://server/middleware/validator.js#L1-L211)

## Dependency Analysis

The backend maintains clean dependency relationships with minimal coupling:

```mermaid
graph TB
subgraph "Entry Point"
A[index.js]
end
subgraph "Routing Layer"
B[userRoutes.js]
C[recipeRoutes.js]
end
subgraph "Controller Layer"
D[userController.js]
E[recipeController.js]
end
subgraph "Middleware Layer"
F[auth.js]
G[validator.js]
H[errorHandler.js]
end
subgraph "Model Layer"
I[User.js]
J[Recipe.js]
end
subgraph "Utility Layer"
K[apiResponse.js]
L[asyncHandler.js]
M[generateToken.js]
N[pagination.js]
end
subgraph "Database Layer"
O[connectDB.js]
end
A --> B
A --> C
A --> H
B --> D
C --> E
D --> F
E --> F
D --> G
E --> G
D --> I
E --> J
F --> I
G --> I
G --> J
D --> K
E --> K
F --> L
G --> L
I --> O
J --> O
F --> M
D --> N
E --> N
```

**Diagram sources**
- [index.js:8-9](file://server/index.js#L8-L9)
- [userRoutes.js:16-24](file://server/routes/userRoutes.js#L16-L24)
- [recipeRoutes.js:19-24](file://server/routes/recipeRoutes.js#L19-L24)

### External Dependencies
The project leverages modern JavaScript development tools and libraries:

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Core Framework | express | ^4.18.2 | Web framework |
| Database | mongoose | ^8.0.3 | MongoDB ODM |
| Authentication | jsonwebtoken | ^9.0.2 | JWT tokens |
| Security | bcryptjs | ^2.4.3 | Password hashing |
| Validation | express-validator | ^7.0.1 | Input validation |
| Environment | dotenv | ^16.3.1 | Environment variables |
| CORS | cors | ^2.8.5 | Cross-origin support |

**Section sources**
- [package.json:22-30](file://server/package.json#L22-L30)

## Performance Considerations

### Database Optimization
The application implements several performance optimization strategies:

1. **Indexing Strategy**: Strategic indexes on frequently queried fields
   - User: username, email (unique), followers, following
   - Recipe: user, cuisine, createdAt, likes, tags, text search index

2. **Population Optimization**: Selective field population to minimize data transfer
3. **Pagination**: Built-in pagination for large datasets
4. **Lean Queries**: Memory-efficient queries for read-only operations

### Caching Strategy
```mermaid
flowchart TD
A[Request] --> B{Cache Available?}
B --> |Yes| C[Return Cached Data]
B --> |No| D[Database Query]
D --> E[Process Data]
E --> F[Store in Cache]
F --> G[Return Response]
C --> H[Update Cache TTL]
H --> I[Return Response]
```

### Error Handling and Resilience
The system implements comprehensive error handling:
- Centralized error middleware for consistent error responses
- Graceful handling of database connection failures
- Proper cleanup of resources on unhandled exceptions
- Detailed logging for debugging and monitoring

## Troubleshooting Guide

### Common Issues and Solutions

#### Database Connection Problems
**Symptoms**: Application fails to start with database errors
**Causes**: 
- Invalid MongoDB URI configuration
- Network connectivity issues
- Authentication failures

**Solutions**:
1. Verify MONGODB_URI environment variable
2. Check database credentials and permissions
3. Ensure database server is accessible
4. Review connection logs for specific error details

#### Authentication Failures
**Symptoms**: 401 Unauthorized errors on protected routes
**Causes**:
- Missing or invalid JWT tokens
- Expired authentication tokens
- User account deactivation

**Solutions**:
1. Ensure proper token inclusion in Authorization headers
2. Implement token refresh mechanisms
3. Verify user account status
4. Check JWT_SECRET environment variable

#### Validation Errors
**Symptoms**: 400 Bad Request with validation messages
**Causes**:
- Invalid input data formats
- Missing required fields
- Data exceeding length limits

**Solutions**:
1. Review validation error messages for specific field issues
2. Ensure data matches expected formats
3. Check minimum and maximum length requirements
4. Validate array structures for nested objects

#### Performance Issues
**Symptoms**: Slow response times or timeouts
**Causes**:
- Missing database indexes
- Inefficient queries
- Large data transfers

**Solutions**:
1. Implement appropriate database indexes
2. Optimize query structures
3. Use pagination for large datasets
4. Consider implementing caching layers

**Section sources**
- [errorHandler.js:6-46](file://server/middleware/errorHandler.js#L6-L46)
- [connectDB.js:15-18](file://server/db/connectDB.js#L15-L18)

## Conclusion

The Flavora Express backend server demonstrates modern backend development practices with a well-structured, maintainable codebase. The implementation successfully balances functionality with performance through strategic design decisions including:

- **Clean Architecture**: Clear separation of concerns with modular organization
- **Comprehensive Security**: Multi-layered authentication and authorization system
- **Data Integrity**: Robust validation and error handling mechanisms
- **Scalability**: Optimized database queries and indexing strategies
- **Developer Experience**: Consistent API patterns and comprehensive documentation

The backend provides a solid foundation for the social recipe sharing platform, supporting core features like user management, recipe creation, social interactions, and content discovery. The modular architecture ensures maintainability and extensibility for future feature additions.

Key strengths include the comprehensive validation system, flexible authentication middleware, and efficient database modeling with proper indexing strategies. The standardized API response format and error handling contribute to a consistent developer experience and reliable client-server communication.