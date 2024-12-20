import React from "react";
import { render, screen } from "@testing-library/react";
import AccountEditProfile from "@/components/account/accountEditModal";
import { PublicAccount } from "@/types";

test("renders edit modal", () => {
    // given
    const validUser: PublicAccount = {
        id: 1,
        username: "testuser",
        firstName: "test",
        lastName: "user",
        type: "user",
        phoneNumber: { countryCode: "+32", number: "2020200461" },
        email: "testuser@example.com",
        interests: [],
        events: [],
        joinedEvents: []
    };

    // when
    render(<AccountEditProfile Account={validUser} onclose={() => { }} />);

    // then
    expect(screen.getByText(""));
});