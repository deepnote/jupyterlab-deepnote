// Source:
// deepnote-internal
//
// Path:
// libs/shared/src/utils/assert-unreachable.ts

// Commit SHA:
// ebdadfe8f16b7fb2279c24b2362734909cab5d4d

/**
 * Utility function that uses the typechecker to check that some conditions never happen.
 * Very useful e.g. for checking that we have covered all cases in a switch statement of in a long list of if's.
 * This is purely for typechecking purposes and has no runtime implications (it's just an identity function at runtime).
 * @example See Icon.tsx
 */
export const assertUnreachable = (x: never) => x;
