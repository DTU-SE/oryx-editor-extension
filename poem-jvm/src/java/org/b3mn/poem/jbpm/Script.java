package org.b3mn.poem.jbpm;

import java.io.StringWriter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Script extends Node {

	private String expression;
	private String language;
	private String variable;
	private String text;

	public Script(JSONObject script) {

		this.name = JsonToJpdl.readAttribute(script, "name");
		this.expression = JsonToJpdl.readAttribute(script, "expr");
		this.language = JsonToJpdl.readAttribute(script, "lang");
		this.variable = JsonToJpdl.readAttribute(script, "var");
		this.text = JsonToJpdl.readAttribute(script, "text");
		this.bounds = JsonToJpdl.readBounds(script);

		this.outgoings = JsonToJpdl.readOutgoings(script);
	}
	
	public Script(org.w3c.dom.Node script) {
		
	}

	@Override
	public String toJpdl() throws InvalidModelException {
		StringWriter jpdl = new StringWriter();
		jpdl.write("<script");

		jpdl.write(JsonToJpdl.transformAttribute("name", name));
		jpdl.write(JsonToJpdl.transformAttribute("expr", expression));
		jpdl.write(JsonToJpdl.transformAttribute("lang", language));
		jpdl.write(JsonToJpdl.transformAttribute("var", variable));

		if (bounds != null) {
			jpdl.write(bounds.toJpdl());
		} else {
			throw new InvalidModelException(
					"Invalid Script activity. Bounds is missing.");
		}

		jpdl.write(" >\n");

		if (text != null) {
			jpdl.write("<text>\n");
			jpdl.write(text);
			jpdl.write("\n</text>\n");
		}

		for (Transition t : outgoings) {
			jpdl.write(t.toJpdl());
		}

		jpdl.write("</script>\n");

		return jpdl.toString();
	}

	public String getExpression() {
		return expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getVariable() {
		return variable;
	}

	public void setVariable(String variable) {
		this.variable = variable;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Override
	public JSONObject toJson() throws JSONException {
		JSONObject stencil = new JSONObject();
		stencil.put("id", "script");

		JSONArray outgoing = new JSONArray();
		// TODO add outgoings

		JSONObject properties = new JSONObject();
		properties.put("bgcolor", "#ffffcc");
		if (name != null)
			properties.put("name", name);
		if (expression != null)
			properties.put("expr", expression);
		if (language != null)
			properties.put("lang", language);
		if (variable != null)
			properties.put("var", variable);
		if (text != null)
			properties.put("text", text);

		JSONArray childShapes = new JSONArray();

		return JpdlToJson.createJsonObject(uuid, stencil, outgoing, properties,
				childShapes, bounds.toJson());
	}

}
