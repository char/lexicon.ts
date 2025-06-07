import type { AnyUniverse, Infer, RPCValue } from "@char/lexicon.ts";

type Procedures<U extends AnyUniverse> = string & keyof { [K in keyof U as U[K]["defs"]["main"]["type"] extends "procedure" ? K : never]: void };
type Queries<U extends AnyUniverse> = string & keyof { [K in keyof U as U[K]["defs"]["main"]["type"] extends "query" ? K : never]: void };

type _RPCInfer1<T> = T extends RPCValue ? T : never;
type RPCInfer<U extends AnyUniverse, K extends string> = _RPCInfer1<Infer<U, K>>;

export class XRPC<U extends AnyUniverse> { 
  constructor(public baseUrl: string) {}

  #addParameters(url: URL, parameters: object): void {
    for (const [key, value] of Object.entries(parameters ?? {})) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        url.searchParams.set(key, String(value));
      }

      if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
            url.searchParams.append(key, String(v))
          }
        }
      }
    }
  }

  async call<M extends Procedures<U>>(method: M, opts: Omit<(RPCValue & RPCInfer<U, M>), "output">): Promise<(RPCValue & RPCInfer<U, M>)["output"]> {
    const url = new URL("/xrpc/" + method, this.baseUrl);
    if (opts.parameters) this.#addParameters(url, opts.parameters);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: opts.input ? JSON.stringify(opts.input) : undefined,
    });

    if (res.status === 200) {
      return res.json();
    }

    const body: { error: string; message?: string } = await res.json();
    throw new Error(`${body.error}: ${body.message ?? "no message"}`);
  }

  async get<M extends Queries<U>>(method: M, opts: { parameters: RPCInfer<U, M>["parameters"] }): Promise<RPCInfer<U, M>["output"]> {
    const url = new URL("/xrpc/" + method, this.baseUrl);
    if (opts.parameters) this.#addParameters(url, opts.parameters);

    const res = await fetch(url);

    if (res.status === 200) {
      return res.json();
    }

    const body: { error: string; message?: string } = await res.json();
    throw new Error(`${body.error}: ${body.message ?? "no message"}`)
  }
}
