import request from "supertest";
import jwt from "jsonwebtoken";
import app, { dbConnection, server } from "../server"; // Import your Express app
import mongoose from "mongoose";

describe("Post Controller", () => {
    let token: string;
    let postId: string;

    beforeAll(async () => {
        await dbConnection;

        // Replace with your actual Keycloak credentials
        const keycloakCredentials = {
            serverUrl: "http://localhost:8080",
            username: "test@example.com",
            password: "password",
            clientId: "post-microservice",
            clientSecret: "qD8Yaa2nBvv93TtpJjmZbKgArkOEw30J",
            realm: "microblog",
        };

        // Request a token from the Keycloak server
        const response = await request("http://localhost:8080/") // Replace with your actual Keycloak server URL
            .post(
                `/realms/${keycloakCredentials.realm}/protocol/openid-connect/token`
            )
            .send(
                `username=${keycloakCredentials.username}&password=${keycloakCredentials.password}&client_id=${keycloakCredentials.clientId}&client_secret=${keycloakCredentials.clientSecret}&grant_type=password`
            )
            .set("Content-Type", "application/x-www-form-urlencoded");

        token = response.body.access_token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close(); // Close the server
    });

    describe("createPost", () => {
        it("should create a new post and return 201 status", async () => {
            const postData = { title: "Test Title", content: "Test Content" };

            const response = await request(app)
                .post("/me") // Replace with your actual route
                .set("Authorization", `Bearer ${token}`)
                .send(postData);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(postData.title);
            expect(response.body.content).toBe(postData.content);
            expect(response.body.authorId).toBeDefined();

            postId = response.body._id; // Save the post id for the next test
        });
    });

    describe("updatePost", () => {
        it("should update a post and return 200 status", async () => {
            const updateData = {
                title: "Updated Title",
                content: "Updated Content",
            };

            const response = await request(app)
                .put(`/me/post/${postId}`) // Use the post id from the previous test
                .set("Authorization", `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updateData.title);
            expect(response.body.content).toBe(updateData.content);
            expect(response.body.authorId).toBeDefined();
        });
    });

    describe("deletePost", () => {
        it("should delete a post and return 200 status", async () => {
            const response = await request(app)
                .delete(`/me/post/${postId}`) // Use the post id from the previous test
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });
});
