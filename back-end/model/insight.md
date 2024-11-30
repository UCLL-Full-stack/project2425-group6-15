# Models and Types Overview

## Models

### User

Represents a user in the system.

-   **id**: `number`
-   **firstName**: `string`
-   **lastName**: `string`
-   **phoneNumber**: `string:Phonenumber`
-   **email**: `string`
-   **password**: `string:Hashed`
-   **gender**: `string:Gender`
-   **interests**: `Interest[]`
-   **posts**: `Post[]`
-   **joinedPosts**: `Post[]`

### Interest

Represents an interest that a user can have.

-   **id**: `number`
-   **name**: `string`
-   **description**: `string`

### Post

Represents a post for an activity.

-   **id**: `number`
-   **title**: `string`
-   **description**: `string`
-   **startDate**: `DateTime`
-   **endDate**: `DateTime`
-   **time**: `string`
-   **location**: `string:Location`
-   **activity**: `Activity`
-   **creator**: `User` (relation: "UserPosts")
-   **users**: `User[]`
-   **peopleNeeded**: `number`
-   **preferredGender**: `Creator-Gender|Both-genders`

### Activity

Represents an activity that a user can participate in.

-   **id**: `number`
-   **name**: `string`
-   **type**: `string`

## Types

### UserInput

Input type for creating a user.

-   **id?**: `number`
-   **firstName**: `string`
-   **lastName**: `string`
-   **phoneNumber**: `PhoneNumber`
-   **email**: `string`
-   **password**: `string`
-   **gender**: `Gender`

### UserSummary

Summary type for user information.

-   **firstName**: `string`
-   **lastName**: `string`
-   **email**: `string`
-   **interests**: `Interest[]`
-   **gender**: `Gender`

### Gender

Represents the gender of a user.

-   **male**
-   **female**

### PhoneNumber

Represents a phone number.

-   **countryCode**: `string`
-   **number**: `string`

### Location

Represents a geographical location.

-   **longitude**: `string`
-   **latitude**: `string`

## DB Relations

### User

-   **posts**: One-to-Many with `Post` (relation: "UserPosts")
-   **joinedPosts**: Many-to-Many with `Post` (relation: "UserJoinedPosts")
-   **interests**: Many-to-Many with `Interest` (relation: "UserInterests")

### Post

-   **creator**: Many-to-One with `User` (relation: "UserPosts")
-   **users**: Many-to-Many with `User` (relation: "UserJoinedPosts")
-   **activity**: Many-to-One with `Activity` (relation: "ActivityPosts")

### Interest

-   **users**: Many-to-Many with `User` (relation: "UserInterests")

### Activity

-   **posts**: One-to-Many with `Post` (relation: "ActivityPosts")
