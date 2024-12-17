# Models and Types Overview

## Models

### Account

Represents a account in the system.

-   **id**: `number`
-   **firstName**: `string`
-   **lastName**: `string`
-   **phoneNumber**: `string:Phonenumber`
-   **email**: `string`
-   **password**: `string:Hashed`
-   **gender**: `string:Gender`
-   **interests**: `Interest[]`
-   **events**: `Event[]`
-   **joinedEvents**: `Event[]`

### Interest

Represents an interest that a account can have.

-   **id**: `number`
-   **name**: `string`
-   **description**: `string`

### Event

Represents a event for an activity.

-   **id**: `number`
-   **title**: `string`
-   **description**: `string`
-   **startDate**: `DateTime`
-   **endDate**: `DateTime`
-   **time**: `string`
-   **location**: `string:Location`
-   **activity**: `Activity`
-   **creator**: `Account` (relation: "AccountEvents")
-   **accounts**: `Account[]`
-   **peopleNeeded**: `number`
-   **preferredGender**: `Creator-Gender|Both-genders`

### Activity

Represents an activity that a account can participate in.

-   **id**: `number`
-   **name**: `string`
-   **type**: `string`

## Types

### AccountInput

Input type for creating a account.

-   **id?**: `number`
-   **firstName**: `string`
-   **lastName**: `string`
-   **phoneNumber**: `PhoneNumber`
-   **email**: `string`
-   **password**: `string`
-   **gender**: `Gender`

### AccountSummary

Summary type for account information.

-   **firstName**: `string`
-   **lastName**: `string`
-   **email**: `string`
-   **interests**: `Interest[]`
-   **gender**: `Gender`

### Gender

Represents the gender of a account.

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

### Account

-   **events**: One-to-Many with `Event` (relation: "AccountEvents")
-   **joinedEvents**: Many-to-Many with `Event` (relation: "AccountJoinedEvents")
-   **interests**: Many-to-Many with `Interest` (relation: "AccountInterests")

### Event

-   **creator**: Many-to-One with `Account` (relation: "AccountEvents")
-   **accounts**: Many-to-Many with `Account` (relation: "AccountJoinedEvents")
-   **activity**: Many-to-One with `Activity` (relation: "ActivityEvents")

### Interest

-   **accounts**: Many-to-Many with `Account` (relation: "AccountInterests")

### Activity

-   **events**: One-to-Many with `Event` (relation: "ActivityEvents")
