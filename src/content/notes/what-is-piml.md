---
title: "What I Learned About Physics-Informed Machine Learning — Video 1"
date: "2026-09-16"
category: "PIML"
description: "My notes and current understanding from the first video I watched while learning Physics-Informed Machine Learning."
---

These are my notes from the first video I watched while learning
Physics-Informed Machine Learning (PIML).

I'm still at the beginning of learning this subject, so this is not
meant to be a complete explanation. It is a record of what I
understood from this first video, in my own words.

[Original handwritten notes · PDF](/files/notes/physics-informed-ml-video-1.pdf)

## The Basic Idea

One way I currently understand PIML is as an intersection between
Artificial Intelligence / Machine Learning and Physics.

There seem to be two directions:

- Using AI/ML to discover new physics or physical relationships from data.
- Using already-known physics to guide or constrain an AI/ML model.

The second idea is what I focused on in this video: instead of
letting a machine-learning model learn only from data, we can also
use what we already know about the physical system.

## How Machine Learning Normally Works

The video described a five-stage process:

### 1. Decide on the Problem

First, decide what problem we are trying to solve.

What are the inputs?

What are the outputs?

What are we actually trying to model?

### 2. Gather the Data

We need data that can inform the model.

This can involve obtaining, cleaning, preparing, and possibly
augmenting the data.

For physical systems, the data could come from measurements or
numerical simulations.

### 3. Design an Architecture

We choose an architecture that can represent the problem.

For example, this could be a neural network or another type of model.

### 4. Create a Loss Function

The loss function measures how wrong the model is.

This is where physics becomes interesting.

Instead of only measuring how well the model matches the data,
we can also include information about whether the model satisfies
the physics we know about the system.

### 5. Optimize

The model parameters are adjusted to minimize the loss over the
training data.

In a neural network, these parameters include its weights.

## Where Physics Enters

The main idea I took from the video is that physics can be
incorporated into the learning process.

One way is through the loss function.

A normal loss can measure the difference between the model's
prediction and the available data.

A physics-informed loss can also penalize the model when its
prediction does not satisfy the physical relationships we want it
to follow.

So we are not only asking:

> Does the model match the data?

We can also ask:

> Does the model behave according to the physics?

## Example: Model Reduction

The example in the video involved model reduction for a complicated
fluid-flow problem.

The idea is to take a high-dimensional system and find a
lower-dimensional representation that still captures important
information about the system.

The basic picture I wrote down was:

**High-dimensional data → lower-dimensional representation → learn the dynamics**

### Autoencoder-like Architecture

The example used an architecture similar to an autoencoder.

The high-dimensional data is passed through an encoder and
compressed into a lower-dimensional state, which I noted as z.

The decoder can then use this lower-dimensional representation to
reconstruct the original data.

Conceptually:

**High-dimensional data → encoder → low-dimensional state z → decoder → reconstructed data**

The goal is to find a useful lower-dimensional representation of
the original system.

## Adding Physics

The important part of the example was that the model does not have
to learn only from reconstruction error.

A loss can contain a data-related term as well as a physics-related
term.

Conceptually:

**Loss = data/reconstruction error + physics-related error**

The physics term gives the model an additional constraint.

If we already know something about the physical system, we can use
that knowledge instead of asking the model to learn everything only
from the available data.

## Optimization

After defining the loss function, we optimize the model parameters.

The goal is to find parameters that reduce the loss over the
training data.

In the physics-informed case, the optimization is trying to make
the model fit the data while also satisfying the physical
constraints that were included in the loss.

One thing I took away from the video is that adding more physics can
provide stronger constraints, but it can also require more effort
to formulate those physical constraints correctly.

## What I Think I Understand

My current mental model is:

**Data + Physics → Model → Loss → Optimization**

Normal machine learning learns patterns from data.

PIML can add information about the physical system to that learning
process.

The physics does not necessarily replace the machine-learning
model. It can instead guide or constrain the model through how the
problem and loss function are formulated.

## What I Still Don't Understand

I am still unsure about several things:

- How exactly do we convert a physical law into a loss function?
- How do differential equations become part of a machine-learning model?
- How do we decide how much weight the physics term should have?
- What happens when our knowledge of the physics is incomplete?
- How do we know whether adding physics actually improves a model?
- What kinds of architectures are appropriate for different physical problems?
- How does this work when there is very little data?

## Questions for Further Study

My next questions are:

1. What exactly is a Physics-Informed Neural Network (PINN)?
2. How are differential equations incorporated into a neural-network loss?
3. What does a physics-based loss look like mathematically?
4. How does automatic differentiation help?
5. What is the difference between discovering physics from data and enforcing known physics?
6. How does model reduction connect with PIML?

## Connection to Ghost Battery

One reason I found this topic interesting is that it connects with
an idea I have been exploring around Formula 1 telemetry and energy
use.

I call that idea [Ghost Battery](/projects/ghost-battery): a possible
future problem where I could explore whether physics-informed machine
learning might be useful.

Before trying to apply PIML to that idea, I need to understand the
fundamentals first.

## What I Took Away

The biggest thing I took away from this first video is that machine
learning does not necessarily have to treat the physical world as
just another dataset.

If we already know something about a system, that knowledge can
potentially become part of the learning process.

I am still very early in understanding how this works mathematically,
but I now have a basic picture of why someone might combine machine
learning with physics.
