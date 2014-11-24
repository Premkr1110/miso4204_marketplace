/* ========================================================================
 * Copyright 2014 miso4204
 *
 * Licensed under the MIT, The MIT License (MIT)
 * Copyright (c) 2014 miso4204

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 * ========================================================================


 Source generated by CrudMaker version 1.0.0.qualifier

 */
package co.edu.uniandes.csw.miso4204.reward.service;

import co.edu.uniandes.csw.miso4204.reward.logic.dto.RewardDTO;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import org.glassfish.jersey.client.ClientConfig;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;

@Path("/rewards")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RewardService extends _RewardService {

    //private static String URL_SERVICIO = System.getenv("URL1");
    private static String URL_SERVICIO = "http://localhost:8084/address.services/webresources/addresss";

    @GET
    @Path("/total")
    public RewardDTO getTotalPoint(@QueryParam("id") Long id) {
        return rewardLogicService.getAccumulatedPoints(id);
    }

    @POST
    @Path("/save")
    public RewardDTO saveReward(@Context HttpHeaders httpHeaders, RewardDTO reward) {

        String token = httpHeaders.getRequestHeader("X_REST_USER").get(0);
        ClientConfig config = new ClientConfig();
        Client client = ClientBuilder.newClient(config);
        
        String entity = client.target(URL_SERVICIO)
                .path("51")
                .request(MediaType.APPLICATION_JSON)
                .header("X_REST_USER", token)
                .get(String.class);
        
        System.out.println(entity);
        JsonParser parser = new JsonParser();
        JsonObject object = (JsonObject) parser.parse(entity);
        JsonElement column = object.get("id");        
        String id = column.getAsString();
        System.out.println(id);
        reward.setId(Long.parseLong(id));        
        createReward(reward);
        return reward;
    }

}
