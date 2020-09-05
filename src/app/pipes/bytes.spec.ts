import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { BytesPipe } from "@rapydo/pipes/bytes";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("Pipes", () => {
  let bytes_pipe: BytesPipe;

  beforeEach(() => {
    bytes_pipe = new BytesPipe();
  });

  it("BytesPipe", () => {
    expect(bytes_pipe.transform(0)).toBe("0");
    expect(bytes_pipe.transform(-1)).toBe("-");
    expect(bytes_pipe.transform(10)).toBe("10 bytes");
    expect(bytes_pipe.transform(10240)).toBe("10 kB");
    expect(bytes_pipe.transform(10485760)).toBe("10.0 MB");
    // expect(bytes_pipe.transform(10737418240‬)).toBe("10 GB");
    // expect(bytes_pipe.transform(‭10995116277760‬)).toBe("10 TB");
    // expect(bytes_pipe.transform(1,125899906842624e+16‬)).toBe("10 PB");

    // expect(bytes_pipe.transform({'a': 1, 'b': 2})).toBe([{'key': 'a', value: 1}, {'key': 'b', value: 2}]);
  });
});