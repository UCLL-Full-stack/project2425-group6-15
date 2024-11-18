# Models and Types Overview

## Models

### User

Represents a user in the system.

-   **id**: `number`
-   **firstName**: `string`
-   **lastName**: `string`
-   **phoneNumber**: `string`
-   **email**: `string`
-   **password**: `string`
-   **gender**: `string`
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
-   **activity**: `Activity`
-   **creator**: `User`
-   **interestedUsers**: `User[]`
-   **acceptedUsers**: `User[]`
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
