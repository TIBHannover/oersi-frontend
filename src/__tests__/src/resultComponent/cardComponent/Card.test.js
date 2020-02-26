import React from "react";
import { mount, shallow } from "../../../../setupFiles";
import Card from "../../../../components/resultComponent/card/Card";

const dataPropsPassing = {
  author: "Edmond",
  license: "CC-LC-UU-Test",
  url: "http://test.com",
  thumbnail: "http://testphotourl.com",
  name: "Document Test",
  about: "This is just a object for test",
  timestamp: "2020-02-20T17:35:02.537Z",
  modificationdate: "2020-02-20T17:35:02.537Z",
  tags:
    "Sprachgebrauch , Sprachpraxis , Spracherhalt , Herkunftssprache(n) , Deutsch , Migration , Sprachenvielfalt , Mehrsprachigkeit , Bildung und Erziehung , Sprache"
};

describe("CardCompnent ==> Test UI  ", () => {
  let wrapperShadow;
  beforeEach(() => {
    wrapperShadow = shallow(<Card {...dataPropsPassing} />);
  });

  it("CardCompnent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot();
  });

  it(" CardCompnent:  should  wraps content in a div with .card class", () => {
    expect(wrapperShadow.find(".card").length).toBe(1);
  });
});

describe("CardCompnent  ==> Test Props of Component", () => {
  let wrapperMount;
  beforeEach(() => {
    wrapperMount = mount(<Card {...dataPropsPassing} />);
  });

  it(" CardCompnent:  should be not empty props ", () => {
    expect(wrapperMount.props()).toBeTruthy();
  });

  it("CardCompnent :  should be props same as Object ", () => {
    expect(wrapperMount.props()).toMatchObject(dataPropsPassing);
  });

  it("CardCompnent :  should be possibly to add props ", () => {
    wrapperMount.setProps({ cardProp: "Test" });
    expect(wrapperMount.prop("cardProp")).toEqual("Test");
  });
});
