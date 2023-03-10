/*
 * (C) Copyright 2017-2020 OpenVidu (https://openvidu.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package io.openvidu.server.cdr;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.openvidu.server.game.Player;

public class CDREventSignal extends CDREvent {

	private String from;
	private String[] to;
	private String type;
	private String data;

	public CDREventSignal(String sessionId, String uniqueSessionId, String from, String[] to, String type,
			String data) {
		super(CDREventName.signalSent, sessionId, uniqueSessionId, System.currentTimeMillis());
		this.from = from;
		this.to = to;
		this.type = type;
		this.data = data;
	}

	@Override
	public JsonObject toJson() {
		JsonObject json = super.toJson();
		json.addProperty("from", this.from);
		JsonArray toArray = new JsonArray();
		for (String id : this.to) {
			toArray.add(id);
		}
		json.add("to", toArray);
		json.addProperty("type", this.type);
		json.addProperty("data", this.data);
		return json;
	}

}
